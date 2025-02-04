namespace SOPSC.Api.Models.Domains.Users
{
    public class UserWithRole : User
    {
        // Gets or sets the role name associated with the user.
        public string RoleName { get; set; }

        // Gets or sets the role identifier associated with the user.
        public int RoleId { get; set; }

        // Gets or sets the date and time when the user was created.
        public DateTime DateCreated { get; set; }

        // Gets or sets the date and time of the user's last login.
        public bool IsConfirmed { get; set; }
    }
}
