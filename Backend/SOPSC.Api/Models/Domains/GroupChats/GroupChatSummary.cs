namespace SOPSC.Api.Models.Domains.GroupChats;

/// <summary>
/// Represents a summary of a group chat with the latest message info.
/// </summary>
public class GroupChatSummary
{
    public int GroupChatId { get; set; }
    public string Name { get; set; }
    public string LastMessage { get; set; }
    public System.DateTime LastSentTimestamp { get; set; }
    public int UnreadCount { get; set; }
}