namespace SOPSC.Api.Models.Domains.Messages
{
    /// <summary>
    /// Represents the identifiers of a message that has been sent.
    /// </summary>
    public class MessageCreated
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
    }
}