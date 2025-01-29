using System;
using System.Collections.Generic;

namespace SOPSC.Api.Data
{
    /// <summary>
    /// Represents a paginated list of items.
    /// </summary>
    /// <typeparam name="T">The type of items in the paginated list.</typeparam>
    public class Paged<T>
    {
        /// <summary>
        /// Gets the current page index (zero-based).
        /// </summary>
        public int PageIndex { get; }

        /// <summary>
        /// Gets the number of items per page.
        /// </summary>
        public int PageSize { get; }

        /// <summary>
        /// Gets the total number of items across all pages.
        /// </summary>
        public int TotalCount { get; }

        /// <summary>
        /// Gets the total number of pages.
        /// </summary>
        public int TotalPages { get; }

        /// <summary>
        /// Gets the list of items on the current page.
        /// </summary>
        public List<T> PagedItems { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Paged{T}"/> class.
        /// </summary>
        /// <param name="data">The list of items for the current page.</param>
        /// <param name="page">The current page index (zero-based).</param>
        /// <param name="pagesize">The number of items per page.</param>
        /// <param name="totalCount">The total number of items across all pages.</param>
        /// <remarks>
        /// The <paramref name="data"/> parameter is expected to contain only the items for the current page.
        /// </remarks>
        public Paged(List<T> data, int page, int pagesize, int totalCount)
        {
            PageIndex = page;
            PageSize = pagesize;
            PagedItems = data;

            TotalCount = totalCount;
            TotalPages = (int)Math.Ceiling(TotalCount / (double)PageSize);
        }

        /// <summary>
        /// Indicates whether there is a previous page.
        /// </summary>
        public bool HasPreviousPage => PageIndex > 0;

        /// <summary>
        /// Indicates whether there is a next page.
        /// </summary>
        public bool HasNextPage => PageIndex + 1 < TotalPages;
    }
}
