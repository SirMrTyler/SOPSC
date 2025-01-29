namespace SOPSC.Api.Models.Responses
{
    /// <summary>
    /// Represents a response containing a single item of type <typeparamref name="T"/>.
    /// </summary>
    /// <typeparam name="T">The type of the item included in the response.</typeparam>
    /// <remarks>
    /// Inherits from <see cref="SuccessResponse"/> and implements the <see cref="IItemResponse"/> interface.
    /// This class is used for successful API responses that return a single item.
    /// </remarks>
    public class ItemResponse<T> : SuccessResponse, IItemResponse
    {
        /// <summary>
        /// Gets or sets the item returned in the response.
        /// </summary>
        /// <value>
        /// The item of type <typeparamref name="T"/> included in the response.
        /// </value>
        public T Item { get; set; }

        /// <summary>
        /// Explicit implementation of the <see cref="IItemResponse.Item"/> property.
        /// </summary>
        /// <remarks>
        /// This allows the <see cref="ItemResponse{T}"/> class to be used polymorphically as an <see cref="IItemResponse"/>.
        /// </remarks>
        object IItemResponse.Item => Item;
    }
}
