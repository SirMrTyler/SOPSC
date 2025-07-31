using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using System.Threading.Tasks;

namespace SOPSC.Api.Models.Interfaces.Calendar
{
    public interface ICalendarService
    {
        Task<CalendarEvent> AddEventAsync(CalendarEventAddRequest model);
    }
}