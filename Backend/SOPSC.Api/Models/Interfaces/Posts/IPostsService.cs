using System.Collections.Generic;
using SOPSC.Api.Models.Domains.Posts;
using SOPSC.Api.Models.Requests.Posts;

namespace SOPSC.Api.Models.Interfaces.Posts
{
    /// <summary>
    /// Service interface for managing prayer request posts.
    /// </summary>
    public interface IPostsService
    {
        List<Post> GetAll();
        Post GetById(int id);
        int Add(int userId, PostAddRequest model);
        void Update(PostUpdateRequest model);
        void Delete(int id);
        void UpdatePrayerCount(int id);
        List<Comment> GetComments(int prayerId);
        int AddComment(int userId, CommentAddRequest model);
        void DeleteComment(int commentId);
    }
}
