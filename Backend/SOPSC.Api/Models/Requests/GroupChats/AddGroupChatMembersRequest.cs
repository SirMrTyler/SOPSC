using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.GroupChats;

/// <summary>
/// Request model for adding members to a group chat.
/// </summary>
public class AddGroupChatMembersRequest
{
    [Required]
    public List<int> UserIds { get; set; }
}