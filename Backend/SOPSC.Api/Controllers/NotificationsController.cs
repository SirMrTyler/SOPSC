using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Interfaces.Notifications;
using SOPSC.Api.Models.Requests.Notifications;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize(Roles = "Admin,Developer,Member")]
    public class NotificationsController : BaseApiController
    {
        private readonly INotificationService _notificationService;
        private readonly IAuthenticationService<int> _authService;

        public NotificationsController(INotificationService notificationService,
            ILogger<NotificationsController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _notificationService = notificationService;
            _authService = authService;
        }

        [HttpPost("token")]
        public ActionResult<BaseResponse> SaveToken([FromBody] NotificationTokenAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _notificationService.SaveNotificationToken(userId, model.ExpoPushToken, model.DeviceToken, model.Platform);
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
