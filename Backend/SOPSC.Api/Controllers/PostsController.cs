using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SOPSC.Api.Models.Domains.Posts;
using SOPSC.Api.Models.Interfaces.Posts;
using SOPSC.Api.Models.Requests.Posts;
using SOPSC.Api.Models.Responses;
using SOPSC.Api.Services.Auth.Interfaces;
using System;
using System.Collections.Generic;

namespace SOPSC.Api.Controllers
{
    [ApiController]
    [Route("api/posts")]
    [Authorize(Roles = "Member, Admin, Developer, Guest")]
    public class PostsController : BaseApiController
    {
        private readonly IPostsService _service;
        private readonly IAuthenticationService<int> _authService;

        public PostsController(IPostsService service, IAuthenticationService<int> authService, ILogger<PostsController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet]
        public ActionResult<ItemResponse<List<Post>>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Post> list = _service.GetAll();
                if (list == null || list.Count == 0)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<List<Post>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Post>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Post post = _service.GetById(id);
                if (post == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemResponse<Post> { Item = post };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(PostAddRequest model)
        {
            int code = 201;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(userId, model);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(int id, PostUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                model.PrayerId = id;
                int userId = _authService.GetCurrentUserId();
                _service.Update(userId, model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}/prayer")]
        public ActionResult<ItemResponse<Post>> UpdatePrayerCount(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Post post = _service.UpdatePrayerCount(id, userId);
                response = new ItemResponse<Post> { Item = post };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}/comments")]
        public ActionResult<ItemResponse<List<Comment>>> GetComments(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Comment> list = _service.GetComments(id);
                if (list == null || list.Count == 0)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<List<Comment>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpPost("{id:int}/comments")]
        public ActionResult<ItemResponse<int>> AddComment(int id, CommentAddRequest model)
        {
            int code = 201;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                model.PrayerId = id;
                int commentId = _service.AddComment(userId, model);
                response = new ItemResponse<int> { Item = commentId };
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }

        [HttpDelete("comments/{commentId:int}")]
        public ActionResult<SuccessResponse> DeleteComment(int commentId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.DeleteComment(commentId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}.");
            }
            return StatusCode(code, response);
        }
    }
}
