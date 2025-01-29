using SOPSC.Api.Data;
using System.Data;

namespace SOPSC.Api.Data.Interfaces
{
    /// <summary>
    /// Provides methods for retrieving and mapping lookup data from the database.
    /// </summary>
    public interface ILookUpService
    {
        /// <summary>
        /// Retrieves a list of lookup items for a specified table name.
        /// </summary>
        /// <param name="tableName">The name of the table to retrieve lookups from.</param>
        /// <returns>A list of <see cref="LookUp"/> objects representing the lookup data.</returns>
        List<LookUp> GetLookUp(string tableName);

        /// <summary>
        /// Retrieves lookup items for multiple tables.
        /// </summary>
        /// <param name="tableNames">An array of table names to retrieve lookup data from.</param>
        /// <returns>A dictionary where each key is a table name and the value is a list of <see cref="LookUp"/> objects.</returns>
        Dictionary<string, List<LookUp>> GetMany(string[] tableNames);

        /// <summary>
        /// Retrieves 3-column lookup items for multiple tables.
        /// </summary>
        /// <param name="tableNames">An array of table names to retrieve 3-column lookup data from.</param>
        /// <returns>
        /// A dictionary where each key is a table name and the value is a list of <see cref="LookUp3Col"/> objects.
        /// </returns>
        Dictionary<string, List<LookUp3Col>> GetMany3Col(string[] tableNames);

        /// <summary>
        /// Maps a single record from the data reader to a <see cref="LookUp"/> object.
        /// </summary>
        /// <param name="reader">The <see cref="IDataReader"/> containing the lookup data.</param>
        /// <param name="startingIndex">
        /// A reference to the starting index for reading the data columns.
        /// </param>
        /// <returns>A <see cref="LookUp"/> object containing the mapped data.</returns>
        LookUp MapSingleLookUp(IDataReader reader, ref int startingIndex);

        /// <summary>
        /// Maps a single record from the data reader to a <see cref="LookUp3Col"/> object.
        /// </summary>
        /// <param name="reader">The <see cref="IDataReader"/> containing the 3-column lookup data.</param>
        /// <param name="startingIndex">
        /// A reference to the starting index for reading the data columns.
        /// </param>
        /// <returns>A <see cref="LookUp3Col"/> object containing the mapped data.</returns>
        LookUp3Col MapSingleLookUp3Col(IDataReader reader, ref int startingIndex);
    }
}
