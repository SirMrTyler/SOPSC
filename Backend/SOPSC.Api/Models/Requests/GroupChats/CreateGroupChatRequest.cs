using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.GroupChats;

/// <summary>
/// Request model for creating a group chat.
/// </summary>
public class CreateGroupChatRequest
{
    [Required]
    public string Name { get; set; }

    /// <summary>
    /// User ids to include in the group chat.
    /// </summary>
    [Required]
    public List<int> UserIds { get; set; }
}