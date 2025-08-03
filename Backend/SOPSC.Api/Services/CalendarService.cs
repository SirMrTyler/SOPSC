using Microsoft.Extensions.Configuration;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Interfaces.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using System.Threading.Tasks;
using System.IO;
using SOPSC.Api.Data.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

//
// This service communicates with Google Calendar using OAuth2 service account
// credentials. The previous implementation used an API key and direct HTTP
// requests which resulted in 400 errors. We now load a service account key file
// from configuration and use the Google.Apis client libraries to insert events.
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

        public async Task<int> AddEventAsync(CalendarEventAddRequest model, int createdById)
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

            // Validate and parse date + time
            if (!DateTime.TryParse($"{model.Date}T{model.StartTime}", out var start))
            {
                throw new FormatException($"Invalid data/time format: '{model.Date}T{model.StartTime}'");
            }

            if (!int.TryParse(model.Duration, out var mins) || mins <= 0)
            {
                mins = 60; // Default to 1 hour
            }

            var end = start.AddMinutes(mins);

            // Log what we're sending to google
            _logger.LogInformation("[CalendarService] Creating calendar event with:");
            _logger.LogInformation($"- Title: {model.Title}");
            _logger.LogInformation($"- Description: {model.Description}");
            _logger.LogInformation($"- Start: {start:o}");
            _logger.LogInformation($"- End: {end:o}");
            _logger.LogInformation($"- MeetLink: {model.MeetLink}");
            _logger.LogInformation($"- Category: {model.Category}");
            _logger.LogInformation($"- Calendar ID: {calendarId}");

            var body = new Event
            {
                Summary = model.Title,
                Description = model.Description,
                Start = new EventDateTime { DateTime = start },
                End = new EventDateTime { DateTime = end },
                Location = string.IsNullOrWhiteSpace(model.MeetLink) ? null : model.MeetLink
            };

            var request = service.Events.Insert(body, calendarId);
            try
            {
                var created = await request.ExecuteAsync();

                int eventId = 0;
                string procName = "[dbo].[CalendarEvents_Insert]";
                _dataProvider.ExecuteNonQuery(procName,
                    delegate (SqlParameterCollection param)
                    {
                        param.AddWithValue("@GoogleEventId", created.Id);
                        param.AddWithValue("@StartDateTime", start);
                        param.AddWithValue("@EndDateTime", end);
                        param.AddWithValue("@Title", model.Title);
                        param.AddWithValue("@Description", model.Description ?? (object)DBNull.Value);
                        param.AddWithValue("@Category", model.Category ?? (object)DBNull.Value);
                        param.AddWithValue("@MeetLink", string.IsNullOrWhiteSpace(model.MeetLink) ? (object)DBNull.Value : model.MeetLink);
                        param.AddWithValue("@CreatedBy", createdById);

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

                return eventId;
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
    }
}