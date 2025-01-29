using Microsoft.Data.SqlClient;
using System.Data;

namespace SOPSC.Api.Data.Interfaces
{
    /// <summary>
    /// Provides an abstraction for executing SQL commands and stored procedures 
    /// with input and output parameter support.
    /// </summary>
    public interface IDataProvider
    {
        /// <summary>
        /// Executes a SQL stored procedure or command that retrieves data from the database.
        /// </summary>
        /// <param name="storedProc">The name of the stored procedure to execute.</param>
        /// <param name="inputParamMapper">
        /// A delegate to map input parameters to the SQL command using a <see cref="SqlParameterCollection"/>.
        /// </param>
        /// <param name="singleRecordMapper">
        /// A delegate to map a single record (row) returned by the <see cref="IDataReader"/>.
        /// </param>
        /// <param name="returnParameters">
        /// A delegate to handle output parameters returned by the stored procedure. Optional.
        /// </param>
        /// <param name="cmdModifier">
        /// A delegate to modify the <see cref="SqlCommand"/> object before execution, such as setting a timeout. Optional.
        /// </param>
        /// <remarks>
        /// Use this method when executing stored procedures or queries that return result sets.
        /// </remarks>
        void ExecuteCmd(
            string storedProc,
            Action<SqlParameterCollection> inputParamMapper,
            Action<IDataReader, short> singleRecordMapper,
            Action<SqlParameterCollection> returnParameters = null,
            Action<SqlCommand> cmdModifier = null);

        /// <summary>
        /// Executes a SQL stored procedure or command that does not return a result set.
        /// </summary>
        /// <param name="storedproc">The name of the stored procedure to execute.</param>
        /// <param name="inputParamMapper">
        /// A delegate to map input parameters to the SQL command using a <see cref="SqlParameterCollection"/>.
        /// </param>
        /// <param name="returnParameters">
        /// A delegate to handle output parameters returned by the stored procedure. Optional.
        /// </param>
        /// <returns>
        /// The number of rows affected by the command.
        /// </returns>
        /// <remarks>
        /// Use this method for operations such as INSERT, UPDATE, or DELETE.
        /// </remarks>
        int ExecuteNonQuery(
            string storedproc,
            Action<SqlParameterCollection> inputParamMapper,
            Action<SqlParameterCollection> returnParameters = null);
    }
}
