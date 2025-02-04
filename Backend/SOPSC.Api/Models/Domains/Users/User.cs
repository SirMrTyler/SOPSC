namespace SOPSC.Api.Models.Domains.Users
{
    /// <summary>
    /// Represents a user within the application, inheriting from <see cref="BaseUser"/>.
    /// </summary>
    public class User : BaseUser
    {
        // Gets or sets the date and time when the user was created.
        public DateTime DateCreated { get; set; }

        // Gets or sets the date and time of the user's last login.
        public DateTime? LastLoginDate { get; set; }

        public bool IsActive { get; set; }

        // Gets or sets the total hours served by the user.
        public decimal? HoursServed { get; set; }

        // Gets or sets a value indicating whether the user has been confirmed.
        public bool IsConfirmed { get; set; }
    }
}
