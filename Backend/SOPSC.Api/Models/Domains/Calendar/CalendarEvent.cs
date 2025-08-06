using System;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Domains.Calendar;

public class CalendarEvent
{
    /// <summary>
    /// The starting date and time of the event in UTC.
    /// </summary>
    [Required]
    public DateTime StartDateTime { get; set; }

    /// <summary>
    /// The ending date and time of the event in UTC.
    /// </summary>
    [Required]
    public DateTime EndDateTime { get; set; }

    [Required]
    [StringLength(255)]
    public string Title { get; set; }

    public string? Description { get; set; }

    [StringLength(100)]
    public string? Category { get; set; }

    public string? MeetLink { get; set; }
}