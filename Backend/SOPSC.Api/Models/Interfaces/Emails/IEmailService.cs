using SOPSC.Api.Models.Requests.Emails;
using System.Threading.Tasks;

namespace SOPSC.Api.Models.Interfaces.Emails
{
    /// <summary>
    /// Provides methods for sending various types of emails.
    /// </summary>
    public interface IEmailService
    {
        /// <summary>
        /// Sends a test email to verify email functionality.
        /// </summary>
        /// <param name="request">
        /// The <see cref="SendEmailRequest"/> object containing the email recipient, subject, and body.
        /// </param>
        Task SendTestEmail(SendEmailRequest request);

        /// <summary>
        /// Sends an administrative message email.
        /// </summary>
        /// <param name="request">
        /// The <see cref="SendEmailRequest"/> object containing the email recipient, subject, and body.
        /// </param>
        Task SendAdminMessage(SendEmailRequest request);

        /// <summary>
        /// Sends a new user confirmation email with a confirmation URL.
        /// </summary>
        /// <param name="request">
        /// The <see cref="SendEmailRequest"/> object containing the email recipient, subject, and body.
        /// </param>
        /// <param name="confirmUrl">
        /// The confirmation URL to be included in the email for user account verification.
        /// </param>
        Task NewUserEmail(SendEmailRequest request, string confirmUrl);
    }
}
