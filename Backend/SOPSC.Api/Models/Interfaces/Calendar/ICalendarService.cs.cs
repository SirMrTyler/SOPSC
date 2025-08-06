using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SOPSC.Api.Models.Interfaces.Calendar
{
    public interface ICalendarService
    {
        Task<int> AddEventAsync(CalendarEventAddRequest model, int createdById);
        Task<List<CalendarEvent>> GetEventsAsync(DateTime start, DateTime end);
        Task UpdateEventAsync(int id, CalendarEventAddRequest model);
    }
}