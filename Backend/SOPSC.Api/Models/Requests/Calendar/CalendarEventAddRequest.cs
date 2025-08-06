using SOPSC.Api.Models.Domains.Calendar;

namespace SOPSC.Api.Models.Requests.Calendar
{
    public class CalendarEventAddRequest : CalendarEvent
    {
        /// <summary>
        /// Indicates whether the MeetLink should be included for this event.
        /// </summary>
        public bool IncludeMeetLink { get; set; }
    }
}