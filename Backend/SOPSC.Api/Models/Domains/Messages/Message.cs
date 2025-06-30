namespace SOPSC.Api.Models.Domains.Messages
{
    /// <summary>
    /// Represents an individual message exchanged between users.
    /// </summary>
    public class Message
    {
        public int MessageId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; }
        public int RecipientId { get; set; }
        public string RecipientName { get; set; }
        public string MessageContent { get; set; }
        public System.DateTime SentTimestamp { get; set; }
        public System.DateTime? ReadTimestamp { get; set; }
        public bool IsRead { get; set; }
    }
}