namespace SOPSC.Api.Models.Domains.GroupChats;

/// <summary>
/// Represents a user participating in a group chat.
/// Contains only information needed for display.
/// </summary>
public class GroupChatMember
{
    public int UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int RoleId { get; set; }
}