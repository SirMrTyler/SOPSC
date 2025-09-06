using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services;
using SOPSC.Api.Services.Auth.Interfaces;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/devices")]
    [Authorize(Roles = "Member, Admin, Developer, Guest")]
    public class DevicesController : BaseApiController
    {
        private readonly IDevicesService _devicesService;
        private readonly IAuthenticationService<int> _authService;

        public DevicesController(
            IDevicesService devicesService,
            IAuthenticationService<int> authService,
            ILogger<DevicesController> logger) : base(logger)
        {
            _devicesService = devicesService;
            _authService = authService;
        }

        public class DeviceRegistrationRequest
        {
            public string DeviceId { get; set; }
            public string Platform { get; set; }
            public string ExpoPushToken { get; set; }
        }

        [HttpPost("register")]
        public async Task<ActionResult<SuccessResponse>> Register(DeviceRegistrationRequest model)
        {
            int code = 200;
            BaseResponse response;
            try
            {
                int userId = _authService.GetCurrentUserId();
                await _devicesService.UpsertAsync(userId, model.DeviceId, model.Platform, model.ExpoPushToken);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }

            return StatusCode(code, response);
        }
    }
}
