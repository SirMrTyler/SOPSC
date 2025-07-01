using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.Messages;
using SOPSC.Api.Models.Interfaces.Messages;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Models.Requests.Messages;
using SOPSC.Api.Services.Auth.Interfaces;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/messages")]
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IMessagesService _messagesService;
        private readonly IAuthenticationService<int> _authService;

        public MessagesController(
            IMessagesService messagesService,
            IAuthenticationService<int> authService,
            ILogger<MessagesController> logger) : base(logger)
        {
            _messagesService = messagesService;
            _authService = authService;
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

        [HttpGet("{otherUserId:int}")]
        public ActionResult<ItemResponse<Paged<Message>>> GetConversation(int otherUserId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Message> paged = _messagesService.GetConversationByUserId(userId, otherUserId, pageIndex, pageSize);

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
        public ActionResult<ItemResponse<int>> Send(SendMessageRequest model)
        {
            int code = 201;
            BaseResponse response = null;
            try
            {
                int senderId = _authService.GetCurrentUserId();
                int id = _messagesService.SendMessage(senderId, model.RecipientId, model.MessageContent);
                response = new ItemResponse<int> { Item = id };
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
    }
}