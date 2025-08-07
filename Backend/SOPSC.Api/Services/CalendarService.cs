using Microsoft.Extensions.Configuration;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using SOPSC.Api.Models.Interfaces.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using SOPSC.Api.Models.Domains.Calendar;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using SOPSC.Api.Data.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Linq;

namespace SOPSC.Api.Services
{
    public class CalendarService : ICalendarService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<CalendarService> _logger;
        private readonly IDataProvider _dataProvider;

        public CalendarService(IDataProvider dataProvider, IConfiguration config, ILogger<CalendarService> logger)
        {
            _dataProvider = dataProvider;
            _config = config;
            _logger = logger;
        }

        public async Task<CalendarEventCreated> AddEventAsync(CalendarEventAddRequest model, int createdById)
        {
            var calendarId = _config["GoogleCalendar:CalendarId"];
            var credPath = _config["GoogleCalendar:ServiceAccountCredentialsPath"];

            if (string.IsNullOrWhiteSpace(calendarId))
            {
                throw new System.InvalidOperationException("Google Calendar ID is not configured.");
            }

            if (string.IsNullOrWhiteSpace(credPath) || !File.Exists(credPath))
            {
                throw new System.InvalidOperationException("Google service account credentials file not found.");
            }

            GoogleCredential credential;
            using (var stream = new FileStream(credPath, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream)
                    .CreateScoped(Google.Apis.Calendar.v3.CalendarService.Scope.CalendarEvents);
            }

            var service = new Google.Apis.Calendar.v3.CalendarService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "SOPSC.Api"
            });

            var start = model.StartDateTime;
            var end = model.EndDateTime;

            if (end <= start)
            {
                throw new ArgumentException("EndDateTime must be after StartDateTime.");
            }

            _logger.LogInformation("[CalendarService] Creating calendar event with:");
            _logger.LogInformation($"- Title: {model.Title}");
            _logger.LogInformation($"- Description: {model.Description}");
            _logger.LogInformation($"- Start: {start:o}");
            _logger.LogInformation($"- End: {end:o}");
            _logger.LogInformation($"- IncludeMeetLink: {model.IncludeMeetLink}");
            _logger.LogInformation($"- Category: {model.Category}");
            _logger.LogInformation($"- Calendar ID: {calendarId}");

            var body = new Event
            {
                Summary = model.Title,
                Description = model.Description,
                Start = new EventDateTime { DateTime = start },
                End = new EventDateTime { DateTime = end }
            };
            if (model.IncludeMeetLink)
            {
                body.ConferenceData = new ConferenceData
                {
                    CreateRequest = new CreateConferenceRequest
                    {
                        ConferenceSolutionKey = new ConferenceSolutionKey { Type = "hangoutsMeet" },
                        RequestId = Guid.NewGuid().ToString()
                    }
                };
            }

            var request = service.Events.Insert(body, calendarId);
            if (model.IncludeMeetLink)
            {
                request.ConferenceDataVersion = 1;
            }
            try
            {
                var created = await request.ExecuteAsync();
                string meetLink = created.HangoutLink ??
                    created.ConferenceData?.EntryPoints?.FirstOrDefault(ep => ep.EntryPointType == "video")?.Uri;

                int eventId = 0;
                string procName = model.IncludeMeetLink ?
                    "[dbo].[CalendarEvents_InsertWithLink]" :
                    "[dbo].[CalendarEvents_InsertNoLink]";
                _dataProvider.ExecuteNonQuery(procName,
                    delegate (SqlParameterCollection param)
                    {
                        param.AddWithValue("@GoogleEventId", created.Id);
                        param.AddWithValue("@StartDateTime", start);
                        param.AddWithValue("@EndDateTime", end);
                        param.AddWithValue("@Title", model.Title);
                        param.AddWithValue("@Description", model.Description ?? (object)DBNull.Value);
                        param.AddWithValue("@Category", model.Category ?? (object)DBNull.Value);
                        param.AddWithValue("@CreatedBy", createdById);
                        if (model.IncludeMeetLink)
                        {
                            param.AddWithValue("@MeetLink", meetLink);
                        }
                        SqlParameter idOut = new SqlParameter("@EventId", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        param.Add(idOut);
                    },
                    delegate (SqlParameterCollection returnCollection)
                    {
                        object oId = returnCollection["@EventId"].Value;
                        int.TryParse(oId.ToString(), out eventId);
                    });

                return new CalendarEventCreated
                {
                    Id = eventId,
                    MeetLink = meetLink
                };
            }
            catch (Google.GoogleApiException ex)
            {
                _logger.LogError("[CalendarService] Google API Error:");
                _logger.LogError($"- StatusCode: {ex.HttpStatusCode}");
                _logger.LogError($"- Message: {ex.Message}");
                _logger.LogError($"- Errors: {ex.Error?.Errors?.FirstOrDefault()?.Message}");
                throw;
            }
        }

        public async Task UpdateEventAsync(int id, CalendarEventAddRequest model)
        {
            var calendarId = _config["GoogleCalendar:CalendarId"];
            var credPath = _config["GoogleCalendar:ServiceAccountCredentialsPath"];

            if (string.IsNullOrWhiteSpace(calendarId))
            {
                throw new System.InvalidOperationException("Google Calendar ID is not configured.");
            }

            if (string.IsNullOrWhiteSpace(credPath) || !File.Exists(credPath))
            {
                throw new System.InvalidOperationException("Google service account credentials file not found.");
            }

            GoogleCredential credential;
            using (var stream = new FileStream(credPath, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream)
                    .CreateScoped(Google.Apis.Calendar.v3.CalendarService.Scope.CalendarEvents);
            }

            var service = new Google.Apis.Calendar.v3.CalendarService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "SOPSC.Api"
            });

            var start = model.StartDateTime;
            var end = model.EndDateTime;

            if (end <= start)
            {
                throw new ArgumentException("EndDateTime must be after StartDateTime.");
            }

            string googleEventId = null;
            _dataProvider.ExecuteCmd("[dbo].[CalendarEvents_SelectById]",
                param => param.AddWithValue("@EventId", id),
                delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    reader.GetSafeInt32(startingIndex++); // EventId
                    googleEventId = reader.GetSafeString(startingIndex++);
                });

            if (!string.IsNullOrWhiteSpace(googleEventId))
            {
                var body = new Event
                {
                    Summary = model.Title,
                    Description = model.Description,
                    Start = new EventDateTime { DateTime = start },
                    End = new EventDateTime { DateTime = end }
                };

                var request = service.Events.Update(body, calendarId, googleEventId);
                await request.ExecuteAsync();
            }

            string procName = "[dbo].[CalendarEvents_Update]";
            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@EventId", id);
                    param.AddWithValue("@GoogleEventId", googleEventId ?? (object)DBNull.Value);
                    param.AddWithValue("@StartDateTime", start);
                    param.AddWithValue("@EndDateTime", end);
                    param.AddWithValue("@Title", model.Title);
                    param.AddWithValue("@Description", model.Description ?? (object)DBNull.Value);
                    param.AddWithValue("@Category", model.Category ?? (object)DBNull.Value);
                    if (model.IncludeMeetLink && !string.IsNullOrEmpty(model.MeetLink))
                    {
                        param.AddWithValue("@MeetLink", model.MeetLink);
                    }
                    else
                    {
                        param.AddWithValue("@MeetLink", DBNull.Value);
                    }
                });
        }

        public Task<List<CalendarEvent>> GetEventsAsync(DateTime start, DateTime end)
        {
            List<CalendarEvent> list = null;
            string procName = "[dbo].[CalendarEvents_SelectByDateRange]";

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@StartDateTime", start);
                    param.AddWithValue("@EndDateTime", end);
                },
                delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    CalendarEvent evt = new CalendarEvent
                    {
                        Id = reader.GetSafeInt32(startingIndex++),
                        StartDateTime = reader.GetSafeUtcDateTime(startingIndex++),
                        EndDateTime = reader.GetSafeUtcDateTime(startingIndex++),
                        Title = reader.GetSafeString(startingIndex++),
                        Description = reader.GetSafeString(startingIndex++),
                        Category = reader.GetSafeString(startingIndex++),
                        MeetLink = reader.GetSafeString(startingIndex++)
                    };

                    if (list == null)
                    {
                        list = new List<CalendarEvent>();
                    }
                    list.Add(evt);
                });

            return Task.FromResult(list);
        }
    }
}