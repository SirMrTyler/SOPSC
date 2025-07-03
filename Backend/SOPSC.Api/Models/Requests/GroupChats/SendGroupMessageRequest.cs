using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.GroupChats;

/// <summary>
/// Request model for sending a message to a group chat.
/// </summary>
public class SendGroupMessageRequest
{
    [Required]
    public string MessageContent { get; set; }
}