using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SOPSC.Api.Models;
using SOPSC.Api.Models.Responses;
using System.Net;

namespace SOPSC.Api.Controllers
{
    /// <summary>
    /// Serves as the base class for all API controllers. Provides common functionality for returning consistent HTTP responses.
    /// </summary>
    /// <remarks>
    /// <para>
    /// All API controllers in the project must inherit from this class. It provides methods to simplify returning standard HTTP responses, 
    /// such as 200 OK, 201 Created, 400 Bad Request, and custom responses.
    /// </para>
    /// <para>
    /// The class also integrates logging functionality using the provided <see cref="ILogger"/> instance, ensuring consistent controller logging.
    /// </para>
    /// </remarks>
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        /// <summary>
        /// Provides a logger instance for the controller.
        /// </summary>
        protected ILogger Logger { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseApiController"/> class.
        /// </summary>
        /// <param name="logger">
        /// The logger instance used for logging information, warnings, and errors within the controller.
        /// </param>
        public BaseApiController(ILogger logger)
        {
            logger.LogInformation($"Controller Firing {this.GetType().Name} ");
            Logger = logger;
        }

        /// <summary>
        /// Returns an HTTP 200 OK response with the provided response object.
        /// </summary>
        /// <remarks>
        /// Use this method to return a successful response where no new resources are created.
        /// </remarks>
        /// <param name="response">The response object to include in the HTTP body.</param>
        /// <returns>An <see cref="OkObjectResult"/> representing HTTP 200 OK.</returns>
        protected OkObjectResult Ok200(BaseResponse response)
        {
            return base.Ok(response);
        }

        /// <summary>
        /// Returns an HTTP 201 Created response with the provided response object.
        /// </summary>
        /// <remarks>
        /// Use this method to return a response when a new resource is successfully created. 
        /// The location of the new resource is included in the response's <c>Location</c> header.
        /// </remarks>
        /// <param name="response">
        /// An object implementing <see cref="IItemResponse"/> containing the newly created item's information.
        /// </param>
        /// <returns>A <see cref="CreatedResult"/> representing HTTP 201 Created.</returns>
        protected CreatedResult Created201(IItemResponse response)
        {
            string url = Request.Path + "/" + response.Item.ToString();
            return base.Created(url, response);
        }

        /// <summary>
        /// Returns an HTTP 404 Not Found response with the provided response object.
        /// </summary>
        /// <remarks>
        /// Use this method when a requested resource cannot be found.
        /// </remarks>
        /// <param name="response">The response object to include in the HTTP body.</param>
        /// <returns>An <see cref="ObjectResult"/> representing HTTP 404 Not Found.</returns>
        protected ObjectResult NotFound404(BaseResponse response)
        {
            return base.NotFound(response);
        }

        /// <summary>
        /// Returns a custom HTTP response with the specified status code and response object.
        /// </summary>
        /// <remarks>
        /// Use this method when you need to return a response with a status code other than the standard ones (e.g., 200, 201, 404).
        /// </remarks>
        /// <param name="code">The custom HTTP status code.</param>
        /// <param name="response">The response object to include in the HTTP body.</param>
        /// <returns>An <see cref="ObjectResult"/> representing the custom HTTP response.</returns>
        protected ObjectResult CustomResponse(HttpStatusCode code, BaseResponse response)
        {
            return StatusCode((int)code, response);
        }
    }
}
