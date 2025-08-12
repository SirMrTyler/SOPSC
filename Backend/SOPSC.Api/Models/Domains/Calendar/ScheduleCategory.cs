namespace SOPSC.Api.Models.Domains.Calendar;

public class ScheduleCategory
{
    public int CategoryId { get; set; }
    public string Name { get; set; }
    public string ColorValue { get; set; }
    public string? UserIds { get; set; }
}