using System.Data;

namespace SOPSC.Api.Models.Interfaces.Users
{
    /// <summary>
    /// Defines a contract for mapping user data from a data reader to a base user object.
    /// </summary>
    public interface IBaseUserMapper
    {
        /// <summary>
        /// Maps the base user properties from the provided <see cref="IDataReader"/>.
        /// </summary>
        /// <param name="reader">The data reader containing user data.</param>
        /// <param name="startingIndex">
        /// A reference to the starting index in the data reader.
        /// This index is incremented as data fields are read.
        /// </param>
        /// <returns>
        /// Returns the current instance of <see cref="IBaseUserMapper"/> with the mapped data.
        /// </returns>
        IBaseUserMapper MapBaseUser(IDataReader reader, ref int startingIndex);
    }
}
