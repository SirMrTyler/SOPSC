using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Interfaces.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/calendar")]
    [Authorize(Roles = "Admin,Developer")]
    public class CalendarController : BaseApiController
    {
        private readonly ICalendarService _calendarService;
        private readonly IAuthenticationService<int> _authService;

        public CalendarController(ICalendarService calendarService,
            IAuthenticationService<int> authService,
            ILogger<CalendarController> logger) : base(logger)
        {
            _calendarService = calendarService;
            _authService = authService;
        }

        [HttpPost("events")]
        public async Task<ActionResult<ItemResponse<CalendarEvent>>> Create(CalendarEventAddRequest model)
        {
            int code = 201;
            BaseResponse response = null;
            try
            {
                var evt = await _calendarService.AddEventAsync(model);
                response = new ItemResponse<CalendarEvent> { Item = evt };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }

            return StatusCode(code, response);
        }
    }
}