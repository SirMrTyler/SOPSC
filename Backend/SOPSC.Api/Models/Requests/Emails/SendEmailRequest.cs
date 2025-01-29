using System.ComponentModel.DataAnnotations;

namespace SOPSC.Api.Models.Requests.Emails
{
    /// <summary>
    /// Represents a request to send an email, containing sender and recipient details, 
    /// along with the email subject and body.
    /// </summary>
    public class SendEmailRequest
    {
        /// <summary>
        /// Gets or sets the sender's information.
        /// </summary>
        /// <remarks>
        /// This property is required and must include the sender's email and name.
        /// </remarks>
        [Required]
        public EmailInfo Sender { get; set; }

        /// <summary>
        /// Gets or sets the recipient's information.
        /// </summary>
        /// <remarks>
        /// This property is required and must include the recipient's email and name.
        /// </remarks>
        [Required]
        public EmailInfo To { get; set; }

        /// <summary>
        /// Gets or sets the subject of the email.
        /// </summary>
        /// <remarks>
        /// This property is required and should describe the purpose of the email.
        /// </remarks>
        [Required]
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets the body content of the email.
        /// </summary>
        /// <remarks>
        /// This property is required and contains the main message to be sent.
        /// </remarks>
        [Required]
        public string Body { get; set; }
        public string HtmlContent { get; set; }
    }
}
