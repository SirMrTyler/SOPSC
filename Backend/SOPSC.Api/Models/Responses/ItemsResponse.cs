using System.Collections.Generic;

namespace SOPSC.Api.Models.Responses
{
    /// <summary>
    /// Represents a response containing a list of items. Inherits from <see cref="SuccessResponse"/>.
    /// </summary>
    /// <typeparam name="T">The type of items contained in the response.</typeparam>
    public class ItemsResponse<T> : SuccessResponse
    {
        /// <summary>
        /// Gets or sets the list of items returned in the response.
        /// </summary>
        /// <value>
        /// A <see cref="List{T}"/> containing the items of type <typeparamref name="T"/>.
        /// </value>
        public List<T> Items { get; set; }
    }
}
