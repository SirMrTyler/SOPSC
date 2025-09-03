namespace SOPSC.Api.Models.Requests.Posts
{
    /// <summary>
    /// Request model for adding a new post.
    /// </summary>
    public class PostAddRequest
    {
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
