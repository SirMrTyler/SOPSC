using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Interfaces.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SOPSC.Api.Services
{
    public class CalendarService : ICalendarService
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;

        public CalendarService(HttpClient client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<CalendarEvent> AddEventAsync(CalendarEventAddRequest model)
        {
            var calendarId = _config["GoogleCalendar:CalendarId"];
            var apiKey = _config["GoogleCalendar:ApiKey"];
            var url = $"https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events?key={apiKey}";

            var start = System.DateTime.Parse($"{model.Date}T{model.StartTime}");
            int.TryParse(model.Duration, out var mins);
            mins = mins == 0 ? 60 : mins;
            var end = start.AddMinutes(mins);

            var body = new
            {
                summary = model.Title,
                description = model.Description,
                start = new { dateTime = start.ToString("yyyy-MM-dd'T'HH:mm:ss") },
                end = new { dateTime = end.ToString("yyyy-MM-dd'T'HH:mm:ss") },
                location = model.MeetLink
            };

            var json = JsonConvert.SerializeObject(body);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            var text = await response.Content.ReadAsStringAsync();
            dynamic obj = JsonConvert.DeserializeObject(text);
            return new CalendarEvent
            {
                Id = obj.id,
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