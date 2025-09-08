namespace SOPSC.Api.Models.Domains.Users
{
    /// <summary>
    /// Represents a subset of user information suitable for lightweight lookups.
    /// </summary>
    public class UserProfile
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfilePicturePath { get; set; }
    }
}
