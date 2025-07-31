namespace SOPSC.Api.Models.Domains.Calendar;

public class CalendarEvent
{
    public string Id { get; set; }
    public System.DateTime Start { get; set; }
    public System.DateTime End { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string MeetLink { get; set; }
}