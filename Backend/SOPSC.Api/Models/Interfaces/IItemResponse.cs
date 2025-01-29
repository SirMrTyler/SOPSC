namespace SOPSC.Api.Models
{
    /// <summary>
    /// Represents a response containing a single item, along with metadata about the response status.
    /// </summary>
    public interface IItemResponse
    {
        /// <summary>
        /// Gets or sets a value indicating whether the response is successful.
        /// </summary>
        bool IsSuccessful { get; set; }

        /// <summary>
        /// Gets or sets the unique transaction identifier for tracking the response.
        /// </summary>
        string TransactionId { get; set; }

        /// <summary>
        /// Gets the item returned in the response.
        /// </summary>
        object Item { get; }
    }
}
