namespace SOPSC.Api.Data
{
    /// <summary>
    /// Represents a simple lookup entity with an identifier and a name.
    /// </summary>
    public class LookUp
    {
        /// <summary>
        /// Gets or sets the unique identifier for the lookup item.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name or description of the lookup item.
        /// </summary>
        public string Name { get; set; }
    }
}
