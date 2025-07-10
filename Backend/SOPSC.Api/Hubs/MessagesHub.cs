using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SOPSC.Api.Hubs
{
    [Authorize(Roles = "Member, Admin, Developer, Guest")]
    public class MessagesHub : Hub
    {
    }
}
