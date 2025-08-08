using SOPSC.Api.Models.Domains.Calendar;
using System.Text.Json.Serialization;

namespace SOPSC.Api.Models.Requests.Calendar
{
    public class CalendarEventAddRequest : CalendarEvent
    {
        /// <summary>
        /// Indicates whether the MeetLink should be included for this event.
        /// </summary>
        [JsonPropertyName("includeMeetLink")]
        public bool IncludeMeetLink { get; set; }
    }
}