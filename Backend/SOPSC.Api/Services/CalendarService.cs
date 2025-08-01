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

        public CalendarService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<CalendarEvent> AddEventAsync(CalendarEventAddRequest model)
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

            var start = System.DateTime.Parse($"{model.Date}T{model.StartTime}");
            int.TryParse(model.Duration, out var mins);
            mins = mins == 0 ? 60 : mins;
            var end = start.AddMinutes(mins);

            var body = new Event
            {
                Summary = model.Title,
                Description = model.Description,
                Start = new EventDateTime { DateTime = start },
                End = new EventDateTime { DateTime = end },
                Location = model.MeetLink
            };

            var request = service.Events.Insert(body, calendarId);
            var created = await request.ExecuteAsync();

            return new CalendarEvent
            {
                Id = created.Id,
                Start = start,
                End = end,
                Title = model.Title,
                Description = model.Description,
                Category = model.Category,
                MeetLink = model.MeetLink
            };
        }
    }
}