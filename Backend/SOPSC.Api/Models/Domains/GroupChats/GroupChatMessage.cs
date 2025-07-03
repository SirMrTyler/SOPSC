namespace SOPSC.Api.Models.Domains.GroupChats;

/// <summary>
/// Represents a message sent in a group chat.
/// </summary>
public class GroupChatMessage
{
    public int MessageId { get; set; }
    public int GroupChatId { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; }
    public string MessageContent { get; set; }
    public System.DateTime SentTimestamp { get; set; }
    public System.DateTime? ReadTimestamp { get; set; }
}