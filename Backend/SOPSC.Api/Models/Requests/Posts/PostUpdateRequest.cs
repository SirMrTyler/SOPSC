namespace SOPSC.Api.Models.Requests.Posts
{
    /// <summary>
    /// Request model for updating a post.
    /// </summary>
    public class PostUpdateRequest : PostAddRequest
    {
        public int PrayerId { get; set; }
    }
}
