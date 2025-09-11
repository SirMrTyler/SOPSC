using Microsoft.Data.SqlClient;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Domains.Posts;
using SOPSC.Api.Models.Interfaces.Posts;
using SOPSC.Api.Models.Requests.Posts;
using System.Collections.Generic;
using System.Data;

namespace SOPSC.Api.Services
{
    /// <summary>
    /// Service for managing prayer request posts and comments.
    /// </summary>
    public class PostsService : IPostsService
    {
        private readonly IDataProvider _data;

        public PostsService(IDataProvider data)
        {
            _data = data;
        }

        public List<Post> GetAll()
        {
            List<Post> list = null;
            string procName = "[dbo].[Posts_SelectAll]";
            _data.ExecuteCmd(procName, null,
                (reader, set) =>
                {
                    int index = 0;
                    Post post = MapPost(reader, ref index);
                    if (list == null)
                    {
                        list = new List<Post>();
                    }
                    list.Add(post);
                });
            return list;
        }

        public Post GetById(int id)
        {
            Post post = null;
            string procName = "[dbo].[Posts_SelectById]";
            _data.ExecuteCmd(procName,
                param => param.AddWithValue("@PrayerId", id),
                (reader, set) =>
                {
                    int index = 0;
                    post = MapPost(reader, ref index);
                });
            return post;
        }

        public int Add(int userId, PostAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Posts_Insert]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    SqlParameter idOut = new("@PrayerId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    param.Add(idOut);
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@Subject", model.Subject);
                    param.AddWithValue("@Body", model.Body);
                },
                returnParameters: param =>
                {
                    int.TryParse(param["@PrayerId"].Value.ToString(), out id);
                });
            return id;
        }

        public void Update(PostUpdateRequest model)
        {
            string procName = "[dbo].[Posts_UpdateById]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    param.AddWithValue("@PrayerId", model.PrayerId);
                    param.AddWithValue("@Subject", model.Subject);
                    param.AddWithValue("@Body", model.Body);
                });
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Posts_DeleteById]";
            _data.ExecuteNonQuery(procName,
                param => param.AddWithValue("@PrayerId", id));
        }

        public void UpdatePrayerCount(int id)
        {
            string procName = "[dbo].[Posts_UpdatePrayerCount]";
            _data.ExecuteNonQuery(procName,
                param => param.AddWithValue("@PrayerId", id));
        }

        public List<Comment> GetComments(int prayerId)
        {
            List<Comment> list = null;
            string procName = "[dbo].[PrayerRequestComments_SelectByPrayerId]";

            try
            {
                _data.ExecuteCmd(procName,
                    param => param.AddWithValue("@PrayerId", prayerId),
                    (reader, set) =>
                    {
                        int index = 0;
                        Comment c = MapComment(reader, ref index);
                        list ??= new List<Comment>();
                        list.Add(c);
                    });
            }
            catch (SqlException ex) when (ex.Number == 2812)
            {
                // Stored procedure not found; return an empty list to avoid API errors
                list = new List<Comment>();
            }

            return list;
        }

        public int AddComment(int userId, CommentAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[PrayerRequestComments_Insert]";
            _data.ExecuteNonQuery(procName,
                param =>
                {
                    SqlParameter idOut = new("@CommentId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    param.Add(idOut);
                    param.AddWithValue("@PrayerId", model.PrayerId);
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@Comment", model.Text);
                },
                returnParameters: param =>
                {
                    int.TryParse(param["@CommentId"].Value.ToString(), out id);
                });
            return id;
        }

        public void DeleteComment(int commentId)
        {
            string procName = "[dbo].[PrayerRequestComments_DeleteById]";
            _data.ExecuteNonQuery(procName,
                param => param.AddWithValue("@CommentId", commentId));
        }

        private static Post MapPost(IDataReader reader, ref int index)
        {
            Post p = new()
            {
                PrayerId = reader.GetSafeInt32(index++),
                AuthorName = reader.GetSafeString(index++),
                Subject = reader.GetSafeString(index++),
                Body = reader.GetSafeString(index++),
                PrayerCount = reader.GetSafeInt32(index++),
                DateCreated = reader.GetSafeUtcDateTime(index++),
                CommentCount = 0
            };
            return p;
        }

        private static Comment MapComment(IDataReader reader, ref int index)
        {
            Comment c = new()
            {
                CommentId = reader.GetSafeInt32(index++),
                PrayerId = reader.GetSafeInt32(index++),
                UserId = reader.GetSafeInt32(index++),
                Text = reader.GetSafeString(index++),
                DateCreated = reader.GetSafeUtcDateTime(index++)
            };
            return c;
        }
    }
}
