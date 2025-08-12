using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Calendar;

public class ScheduleCategoryAddRequest
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; }

    [Required]
    [StringLength(50)]
    public string ColorValue { get; set; }

    public string? UserIds { get; set; }
}