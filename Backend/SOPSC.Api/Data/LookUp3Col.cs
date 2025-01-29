namespace SOPSC.Api.Data
{
    /// <summary>
    /// Represents an extended lookup entity with an additional code property.
    /// Inherits from <see cref="LookUp"/>.
    /// </summary>
    public class LookUp3Col : LookUp
    {
        /// <summary>
        /// Gets or sets the code associated with the lookup item.
        /// </summary>
        public string Code { get; set; }
    }
}
