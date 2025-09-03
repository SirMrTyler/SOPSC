namespace SOPSC.Api.Models.Requests.Posts
{
    /// <summary>
    /// Request model for adding a comment to a post.
    /// </summary>
    public class CommentAddRequest
    {
        public int PrayerId { get; set; }
        public string Text { get; set; }
    }
}
