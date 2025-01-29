namespace SOPSC.Api.Models.Domains.Users
{
    /// <summary>
    /// Represents a user within the application, inheriting from <see cref="BaseUser"/>.
    /// </summary>
    public class User : BaseUser
    {
        /// <summary>
        /// Gets or sets the date and time when the user was created.
        /// </summary>
        public DateTime DateCreated { get; set; }

        /// <summary>
        /// Gets or sets the date and time of the user's last login.
        /// </summary>
        /// <remarks>
        /// This property is nullable and will remain null if the user has never logged in.
        /// </remarks>
        public DateTime? LastLoginDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the user is currently active.
        /// </summary>
        /// <value>
        /// <c>true</c> if the user is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the total hours served by the user.
        /// </summary>
        /// <remarks>
        /// This property is nullable. If no hours are recorded, the value will remain null.
        /// </remarks>
        public decimal? HoursServed { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the user has been confirmed.
        /// </summary>
        /// <value>
        /// <c>true</c> if the user is confirmed; otherwise, <c>false</c>.
        /// </value>
        public bool IsConfirmed { get; set; }
    }
}
