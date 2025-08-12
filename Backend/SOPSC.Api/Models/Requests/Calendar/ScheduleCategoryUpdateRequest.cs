namespace SOPSC.Api.Models.Requests.Calendar;

public class ScheduleCategoryUpdateRequest : ScheduleCategoryAddRequest
{
    public int CategoryId { get; set; }
}