using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Domains.Messages;
using SOPSC.Api.Models.Interfaces.Messages;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services;
using SOPSC.Api.Services.Auth.Interfaces;
using System.Collections.Generic;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/messages")]
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
    }
}