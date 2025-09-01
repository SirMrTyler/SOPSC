using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Interfaces.Notifications;
using SOPSC.Api.Models.Requests.Notifications;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;
using System.Collections.Generic;
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
        private readonly IExpoPushService _expoPushService;

        public NotificationsController(INotificationService notificationService,
            ILogger<NotificationsController> logger,
            IAuthenticationService<int> authService,
            IExpoPushService expoPushService) : base(logger)
        {
            _notificationService = notificationService;
            _authService = authService;
            _expoPushService = expoPushService;
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
                var ticketIds = await _expoPushService.SendPushNotificationsAsync(model.UserIds, model.Title, model.Body, model.Data);
                response = new ItemResponse<List<string>> { Item = ticketIds };
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
