using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Messages
{
    /// <summary>
    /// Represents the information required to send a message to another user.
    /// </summary>
    public class SendMessageRequest
    {
        /// <summary>
        /// Gets or sets the chat id. If zero, a new chat will be created.
        /// </summary>
        public int? ChatId { get; set; }

        /// <summary>
        /// Gets or sets the id of the recipient user.
        /// </summary>
        [Required]
        public int RecipientId { get; set; }

        /// <summary>
        /// Gets or sets the text content of the message.
        /// </summary>
        [Required]
        public string MessageContent { get; set; }
    }
}