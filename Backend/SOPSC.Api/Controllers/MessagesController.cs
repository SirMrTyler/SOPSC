using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.Messages;
using SOPSC.Api.Models.Interfaces.Messages;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Models.Requests.Messages;
using SOPSC.Api.Services.Auth.Interfaces;
using SOPSC.Api.Services;
using SOPSC.Api.Models.Interfaces.Users;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
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
        private readonly IDevicesService _devicesService;
        private readonly IUserService _userService;

        public MessagesController(
            IMessagesService messagesService,
            IAuthenticationService<int> authService,
            IDevicesService devicesService,
            IUserService userService,
            ILogger<MessagesController> logger) : base(logger)
        {
            _messagesService = messagesService;
            _authService = authService;
            _devicesService = devicesService;
            _userService = userService;
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
        public async Task<ActionResult<ItemResponse<object>>> Send([FromBody] SendMessageRequest model)
        {
            if (model == null)
            {
                return BadRequest(ModelState);
            }

            // Ignore binding errors for ChatId so that null or non-numeric values default to a new chat
            ModelState.Remove(nameof(SendMessageRequest.ChatId));
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int code = 201;
            BaseResponse response = null;
            try
            {
                var user = _authService.GetCurrentUser();
                // Replace this line:
                // int chatId = model.ChatId.GetValueOrDefault();

                // With this line:
                int chatId = model.ChatId.GetValueOrDefault();
                MessageCreated created = _messagesService.SendMessage(user.UserId, chatId, model.RecipientId, model.MessageContent);
                int conversationId = created.ChatId;

                var sender = _userService.GetById(user.UserId);
                string title = $"{sender?.FirstName} {sender?.LastName}".Trim();
                if (string.IsNullOrWhiteSpace(title))
                {
                    title = sender?.Email ?? user.Name;
                }

                int tokenCount = 0;

                try
                {
                    IEnumerable<string> tokens = await _devicesService.ListExpoTokensAsync(new[] { model.RecipientId });
                    var tokenList = (tokens ?? Enumerable.Empty<string>())
                        .Where(t => !string.IsNullOrWhiteSpace(t))
                        .Select(t => t.Trim())
                        .Distinct(StringComparer.OrdinalIgnoreCase)
                        .ToList();

                    tokenCount = tokenList.Count;

                    if (tokenCount > 0)
                    {
                        var tokenHashes = tokenList.Select(t => $"{t.Substring(0, Math.Min(6, t.Length))}...{t.Substring(Math.Max(0, t.Length - 4))}");
                        base.Logger.LogInformation("Sending push to {Count} distinct tokens: {Tokens}", tokenCount, string.Join(", ", tokenHashes));

                        using var client = new HttpClient();
                        var payload = tokenList.Select(t => new
                        {
                            to = t,
                            title,
                            body = model.MessageContent,
                            sound = "default",
                            data = new { url = $"sopsc://chat/{conversationId}", conversationId }
                        });
                        var json = JsonSerializer.Serialize(payload);
                        var httpResponse = await client.PostAsync("https://exp.host/--/api/v2/push/send", new StringContent(json, Encoding.UTF8, "application/json"));
                        string expoResponse = await httpResponse.Content.ReadAsStringAsync();
                        base.Logger.LogInformation("Expo response: {Response}", expoResponse);
                    }
                }
                catch (Exception ex)
                {
                    base.Logger.LogError(ex.ToString());
                }
                
                response = new ItemResponse<object> { Item = new { saved = true, pushed = tokenCount } };
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