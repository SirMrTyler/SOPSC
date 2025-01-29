using System;
using System.Collections.Generic;

namespace SOPSC.Api.Models.Responses
{
    /// <summary>
    /// Represents an error response returned from the API.
    /// </summary>
    /// <remarks>
    /// Inherits from <see cref="BaseResponse"/> and adds a list of error messages.
    /// This class is used to provide detailed error information in API responses.
    /// </remarks>
    public class ErrorResponse : BaseResponse
    {
        /// <summary>
        /// Gets or sets a list of error messages.
        /// </summary>
        /// <remarks>
        /// This property contains one or more error messages describing what went wrong during the request.
        /// </remarks>
        public List<string> Errors { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ErrorResponse"/> class with a single error message.
        /// </summary>
        /// <param name="errMsg">A single error message to be added to the response.</param>
        /// <remarks>
        /// The <see cref="IsSuccessful"/> property is automatically set to <c>false</c> in this constructor.
        /// </remarks>
        public ErrorResponse(string errMsg)
        {
            Errors = new List<string>();
            Errors.Add(errMsg);
            IsSuccessful = false;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ErrorResponse"/> class with multiple error messages.
        /// </summary>
        /// <param name="errMsg">A collection of error messages to be added to the response.</param>
        /// <remarks>
        /// The <see cref="IsSuccessful"/> property is automatically set to <c>false</c> in this constructor.
        /// </remarks>
        public ErrorResponse(IEnumerable<string> errMsg)
        {
            Errors = new List<string>();
            Errors.AddRange(errMsg);
            IsSuccessful = false;
        }
    }
}
