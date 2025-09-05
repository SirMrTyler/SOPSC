using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.Messages;
using SOPSC.Api.Models.Interfaces.Messages;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Models.Requests.Messages;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Models.Interfaces.Notifications;
using System.Threading.Tasks;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/messages")]
    [Authorize(Roles = "Member, Admin, Developer, Guest")]
    public class MessagesController : BaseApiController
    {
        private readonly IMessagesService _messagesService;
        private readonly IAuthenticationService<int> _authService;
        private readonly IExpoPushService _expoPushService;
        public MessagesController(
            IMessagesService messagesService,
            IAuthenticationService<int> authService,
            IExpoPushService expoPushService,
            ILogger<MessagesController> logger) : base(logger)
        {
            _messagesService = messagesService;
            _authService = authService;
            _expoPushService = expoPushService;
        }

        [HttpGet]
        public ActionResult<ItemsResponse<MessageConversation>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                List<MessageConversation> list = _messagesService.GetConversations(userId);

                response = new ItemsResponse<MessageConversation> { Items = list ?? new List<MessageConversation>() };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }

            return StatusCode(code, response);
        }

        [HttpGet("{chatId:int}")]
        public ActionResult<ItemResponse<Paged<Message>>> GetConversation(int chatId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Message> paged = _messagesService.GetConversationByChatId(userId, chatId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }

            return StatusCode(code, response);
        }

        [HttpPost]
        public async Task<ActionResult<ItemResponse<MessageCreated>>> Send(SendMessageRequest model)
        {
            int code = 201;
            BaseResponse response = null;
            try
            {
                int senderId = _authService.GetCurrentUserId();
                MessageCreated created = _messagesService.SendMessage(senderId, model.ChatId, model.RecipientId, model.MessageContent);
                response = new ItemResponse<MessageCreated> { Item = created };


                try
                {
                    await _expoPushService.SendPushNotificationsAsync(new[] { model.RecipientId }, "New message", model.MessageContent, new { chatId = created.ChatId });
                }
                catch (Exception ex)
                {
                    base.Logger.LogError(ex.ToString());
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }

            return StatusCode(code, response);
        }

        [HttpPut("{messageId:int}/read")]
        public ActionResult<SuccessResponse> UpdateRead(int messageId, bool isRead)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _messagesService.UpdateReadStatus(messageId, isRead);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }

            return StatusCode(code, response);
        }

        [HttpDelete]
        public ActionResult<SuccessResponse> DeleteMessages(DeleteMessagesRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                string ids = string.Join(',', model.MessageIds);
                _messagesService.DeleteMessages(ids);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }

            return StatusCode(code, response);
        }

        [HttpDelete("conversation/{chatId:int}")]
        public ActionResult<SuccessResponse> DeleteConversation(int chatId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _messagesService.DeleteConversation(chatId);
                response = new SuccessResponse();
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