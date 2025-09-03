using System;

namespace SOPSC.Api.Models.Domains.Posts
{
    /// <summary>
    /// Represents a comment on a prayer request post.
    /// </summary>
    public class Comment
    {
        public int CommentId { get; set; }
        public int PrayerId { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
