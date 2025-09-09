using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.GroupChats;
using SOPSC.Api.Models.Interfaces.GroupChats;
using SOPSC.Api.Models.Interfaces.Notifications;
using SOPSC.Api.Models.Interfaces.Users;
using SOPSC.Api.Models.Requests.GroupChats;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SOPSC.Api.Controllers;

[ApiController]
[Route("api/groupchats")]
[Authorize(Roles = "Member, Admin, Developer, Guest")]
public class GroupChatsController : BaseApiController
{
    private readonly IGroupChatsService _service;
    private readonly IAuthenticationService<int> _authService;
    private readonly INotificationPublisher _notificationPublisher;
    private readonly IUserService _userService;

    public GroupChatsController(
        IGroupChatsService service,
        IAuthenticationService<int> authService,
        INotificationPublisher notificationPublisher,
        IUserService userService,
        ILogger<GroupChatsController> logger)
        : base(logger)
    {
        _service = service;
        _authService = authService;
        _notificationPublisher = notificationPublisher;
        _userService = userService;
    }

    [HttpGet]
    public ActionResult<ItemsResponse<GroupChatSummary>> Get()
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            int userId = _authService.GetCurrentUserId();
            List<GroupChatSummary> list = _service.GetByUserId(userId);
            response = new ItemsResponse<GroupChatSummary> { Items = list ?? new List<GroupChatSummary>() };
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());
            code = 500;
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }
        return StatusCode(code, response);
    }

    [HttpGet("{groupChatId:int}/messages")]
    public ActionResult<ItemResponse<Paged<GroupChatMessage>>> GetMessages(int groupChatId, int pageIndex, int pageSize)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            int userId = _authService.GetCurrentUserId();
            Paged<GroupChatMessage> paged = _service.GetMessages(groupChatId, pageIndex, pageSize, userId);
            response = new ItemResponse<Paged<GroupChatMessage>> { Item = paged };
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());
            code = 500;
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }
        return StatusCode(code, response);
    }

    [HttpPost]
    public ActionResult<ItemResponse<int>> Create(CreateGroupChatRequest model)
    {
        int code = 201;
        BaseResponse response = null;
        try
        {
            int creatorId = _authService.GetCurrentUserId();
            int id = _service.Create(creatorId, model.Name, model.UserIds);
            response = new ItemResponse<int> { Item = id };
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());
            code = 500;
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }
        return StatusCode(code, response);
    }

    [HttpPost("{groupChatId:int}/messages")]
    public async Task<ActionResult<ItemResponse<int>>> SendMessage(int groupChatId, SendGroupMessageRequest model)
    {
        int code = 201;
        BaseResponse response = null;
        try
        {
            int senderId = _authService.GetCurrentUserId();
            int id = _service.SendMessage(groupChatId, senderId, model.MessageContent);
            response = new ItemResponse<int> { Item = id };

            try
            {
                var sender = _userService.GetById(senderId);
                string title = $"{sender?.FirstName} {sender?.LastName}".Trim();
                if (string.IsNullOrWhiteSpace(title))
                {
                    title = sender?.Email ?? "New group message";
                }

                List<GroupChatMember> members = _service.GetMembers(groupChatId);
                List<int> memberIds = members
                    .Select(m => m.UserId)
                    .Where(uid => uid != senderId)
                    .ToList();

                if (memberIds.Count > 0)
                {
                    await _notificationPublisher.PublishAsync(
                        memberIds,
                        title,
                        model.MessageContent,
                        new { groupChatId });
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());
            code = 500;
            response = new ErrorResponse($"Generic Error: {ex.Message}.");
        }
        return StatusCode(code, response);
    }

    [HttpPost("{groupChatId:int}/members")]
    public ActionResult<SuccessResponse> AddMembers(int groupChatId, AddGroupChatMembersRequest model)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            _service.AddMembers(groupChatId, model.UserIds);
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

    [HttpGet("{groupChatId:int}/members")]
    public ActionResult<ItemsResponse<GroupChatMember>> GetMembers(int groupChatId)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            List<GroupChatMember> list = _service.GetMembers(groupChatId);
            response = new ItemsResponse<GroupChatMember> { Items = list };
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