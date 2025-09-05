using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Interfaces.Notifications;
using SOPSC.Api.Models.Requests.Notifications;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;
using System.Threading.Tasks;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize(Roles = "Admin,Developer,Member")]
    public class NotificationsController : BaseApiController
    {
        private readonly INotificationService _notificationService;
        private readonly IAuthenticationService<int> _authService;
        private readonly INotificationPublisher _notificationPublisher;

        public NotificationsController(INotificationService notificationService,
            ILogger<NotificationsController> logger,
            IAuthenticationService<int> authService,
            INotificationPublisher notificationPublisher) : base(logger)
        {
            _notificationService = notificationService;
            _authService = authService;
            _notificationPublisher = notificationPublisher;
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

        [HttpPost("send")]
        public async Task<ActionResult<BaseResponse>> SendNotification([FromBody] PushNotificationRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                await _notificationPublisher.PublishAsync(model.UserIds, model.Title, model.Body, model.Data);
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
