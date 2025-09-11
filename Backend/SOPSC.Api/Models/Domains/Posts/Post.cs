using System;

namespace SOPSC.Api.Models.Domains.Posts
{
    /// <summary>
    /// Represents a prayer request post.
    /// </summary>
    public class Post
    {
        public int PrayerId { get; set; }
        public int UserId { get; set; }
        public string AuthorName { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public int PrayerCount { get; set; }
        public DateTime DateCreated { get; set; }
        public int CommentCount { get; set; }
        public bool HasPrayed { get; set; }
    }
}
