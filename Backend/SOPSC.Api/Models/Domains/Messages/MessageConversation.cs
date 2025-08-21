namespace SOPSC.Api.Models.Domains.Messages
{
    /// <summary>
    /// Represents a summary of the latest message exchanged with another user.
    /// </summary>
    public class MessageConversation
    {
        public int MessageId { get; set; }
        public int ChatId { get; set; }
        public int OtherUserId { get; set; }
        public string OtherUserName { get; set; }
        public string OtherUserProfilePicturePath { get; set; }
        public string MostRecentMessage { get; set; }
        public bool IsRead { get; set; }
        public DateTime SentTimestamp { get; set; }
        public int NumMessages { get; set; }
        public bool IsLastMessageFromUser { get; set; }
    }
}