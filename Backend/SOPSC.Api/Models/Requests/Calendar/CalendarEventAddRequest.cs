using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Calendar
{
    public class CalendarEventAddRequest
    {
        [Required]
        public string Date { get; set; }
        [Required]
        public string StartTime { get; set; }
        [Required]
        public string Duration { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string MeetLink { get; set; }
    }
}