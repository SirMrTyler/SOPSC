namespace SOPSC.Api.Models.Responses
{
    /// <summary>
    /// Represents a successful response. Inherits from <see cref="BaseResponse"/>.
    /// </summary>
    public class SuccessResponse : BaseResponse
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SuccessResponse"/> class.
        /// Sets the <see cref="BaseResponse.IsSuccessful"/> property to <c>true</c>.
        /// </summary>
        public SuccessResponse()
        {
            IsSuccessful = true;
        }
    }
}
