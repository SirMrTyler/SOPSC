using System;

namespace SOPSC.Api.Models.Responses
{
    /// <summary>
    /// The base class for all API response models. 
    /// </summary>
    /// <remarks>
    /// Any response being returned from the API must inherit from this class. 
    /// It provides a standard structure for responses, including a success flag and a unique transaction ID.
    /// </remarks>
    public abstract class BaseResponse
    {
        /// <summary>
        /// Gets or sets a value indicating whether the request was successful.
        /// </summary>
        /// <remarks>
        /// This property indicates the success state of the response.
        /// </remarks>
        public bool IsSuccessful { get; set; }

        /// <summary>
        /// Gets or sets the unique transaction identifier for the response.
        /// </summary>
        /// <remarks>
        /// A new transaction ID is generated each time a response is created, providing a unique identifier
        /// for logging, debugging, and tracing requests.
        /// </remarks>
        public string TransactionId { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseResponse"/> class.
        /// </summary>
        /// <remarks>
        /// This constructor generates a new unique transaction ID for each response instance.
        /// </remarks>
        public BaseResponse()
        {
            // Generate a new transaction ID
            TransactionId = Guid.NewGuid().ToString();
        }
    }
}
