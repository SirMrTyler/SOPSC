namespace SOPSC.Api.Models.Requests.Users
{
    public class UserToken
    {
        /// <summary>
        /// Gets or sets the unique identifier for the token.
        /// </summary>
        public int TokenId { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the user associated with the token.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the token string.
        /// </summary>
        public string Token { get; set; }
        public string DeviceId { get; set; }

        /// <summary>
        /// Gets or sets the date and time the token was created.
        /// </summary>
        public DateTime DateCreated { get; set; }

        /// <summary>
        /// Gets or sets the expiry date and time of the token. Null if the token does not expire.
        /// </summary>
        public DateTime? ExpiryDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the token does not expire.
        /// </summary>
        public bool IsNonExpiring { get; set; }

    }
}
