using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Domains.Calendar;
using SOPSC.Api.Models.Interfaces.Calendar;
using SOPSC.Api.Models.Requests.Calendar;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/calendar")]
    [Authorize(Roles = "Admin,Developer")]
    public class CalendarController : BaseApiController
    {
        private readonly ICalendarService _calendarService;
        private readonly IAuthenticationService<int> _authService;

        public CalendarController(
            ICalendarService calendarService,
            ILogger<CalendarController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _calendarService = calendarService;
            _authService = authService;
        }

        [HttpGet("events")]
        public async Task<ActionResult<BaseResponse>> Get(DateTime start, DateTime end)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                var events = await _calendarService.GetEventsAsync(start, end) ?? new List<CalendarEvent>();
                response = new ItemsResponse<CalendarEvent> { Items = events };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPost("events")]
        public async Task<ActionResult<ItemResponse<CalendarEventCreated>>> Create([FromBody] CalendarEventAddRequest model)
        {
            int code = 201;
            BaseResponse response = null;

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                base.Logger.LogWarning("Invalid Calendar event model: {Errors}", errors);
                return BadRequest(errors);
            }
            try
            {
                int createdById = _authService.GetCurrentUserId();
                CalendarEventCreated created = await _calendarService.AddEventAsync(model, createdById);
                response = new ItemResponse<CalendarEventCreated> { Item = created };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }


        [HttpPut("events/{id:int}")]
        public async Task<ActionResult<SuccessResponse>> Update(int id, [FromBody] CalendarEventAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                base.Logger.LogWarning("Invalid Calendar event model: {Errors}", errors);
                return BadRequest(errors);
            }
            try
            {
                await _calendarService.UpdateEventAsync(id, model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpDelete("events/{id:int}")]
        public async Task<ActionResult<SuccessResponse>> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                await _calendarService.DeleteEventAsync(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
    }
}