namespace SOPSC.Api.Models.Requests.Emails
{
    /// <summary>
    /// Represents the basic information required to send an email.
    /// </summary>
    public class EmailInfo
    {
        /// <summary>
        /// Gets or sets the recipient's email address.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the recipient's name.
        /// </summary>
        public string Name { get; set; }
    }
}
