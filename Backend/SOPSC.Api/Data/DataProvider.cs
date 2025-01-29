using Microsoft.Data.SqlClient;
using SOPSC.Api.Data.Interfaces;
using System.Data;

namespace SOPSC.Api.Data
{
    /// <summary>
    /// Provides methods for executing SQL commands and stored procedures in a database.
    /// </summary>
    /// <remarks>
    /// <para>
    /// This class serves as a concrete implementation of the <see cref="IDataProvider"/> interface. It includes methods
    /// for executing SQL commands (SELECT, INSERT, UPDATE, DELETE) and handling results via delegates.
    /// </para>
    /// <para>
    /// It uses ADO.NET components like <see cref="SqlConnection"/>, <see cref="SqlCommand"/>, and <see cref="SqlDataReader"/>
    /// to interact with the database.
    /// </para>
    /// </remarks>
    public sealed class DataProvider : IDataProvider
    {
        private const string LOG_CAT = "DAO";
        private readonly string connectionString;

        /// <summary>
        /// Initializes a new instance of the <see cref="DataProvider"/> class.
        /// </summary>
        /// <param name="connectionString">The connection string used to connect to the database.</param>
        public DataProvider(string connectionString)
        {
            this.connectionString = connectionString;
        }

        /// <summary>
        /// Executes a stored procedure that reads data and processes each record using a mapping function.
        /// </summary>
        /// <remarks>
        /// This method allows execution of stored procedures that return multiple result sets. The results are processed
        /// using the specified <paramref name="map"/> delegate.
        /// </remarks>
        /// <param name="storedProc">The name of the stored procedure to execute.</param>
        /// <param name="inputParamMapper">A delegate to map input parameters for the stored procedure.</param>
        /// <param name="map">A delegate to map each data row returned by the query.</param>
        /// <param name="returnParameters">
        /// An optional delegate to process output parameters after the stored procedure is executed.
        /// </param>
        /// <param name="cmdModifier">
        /// An optional delegate to modify the <see cref="SqlCommand"/> before execution, e.g., to set command timeouts.
        /// </param>
        /// <exception cref="ArgumentException">Thrown when the <paramref name="map"/> parameter is null.</exception>
        public void ExecuteCmd(
            string storedProc,
            Action<SqlParameterCollection> inputParamMapper,
            Action<IDataReader, short> map,
            Action<SqlParameterCollection> returnParameters = null,
            Action<SqlCommand> cmdModifier = null
        )
        {
            if (map == null)
            {
                throw new ArgumentException("ObjectMapper is required.");
            }
            SqlDataReader reader = null;
            SqlCommand cmd = null;
            SqlConnection conn = null;
            short result = 0;

            try
            {
                using (conn = GetConnection())
                {
                    if (conn != null)
                    {
                        if (conn.State != ConnectionState.Open)
                        {
                            conn.Open();
                        }

                        cmd = GetCommand(conn, storedProc, inputParamMapper);
                        if (cmd != null)
                        {
                            cmdModifier?.Invoke(cmd);
                            reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                            do
                            {
                                while (reader.Read())
                                {
                                    map(reader, result);
                                }
                                result++;
                            } while (reader.NextResult());

                            returnParameters?.Invoke(cmd.Parameters);
                        }
                    }
                }
            }
            finally
            {
                if (reader != null && !reader.IsClosed)
                    reader.Close();
                if (conn != null && conn.State != ConnectionState.Closed)
                    conn.Close();
            }
        }

        /// <summary>
        /// Executes a stored procedure that performs an action (e.g., INSERT, UPDATE, DELETE) without returning data.
        /// </summary>
        /// <remarks>
        /// This method is used for commands that do not return data but may have output parameters.
        /// </remarks>
        /// <param name="storedProc">The name of the stored procedure to execute.</param>
        /// <param name="paramMapper">A delegate to map input parameters for the stored procedure.</param>
        /// <param name="returnParameters">
        /// An optional delegate to process output parameters after the stored procedure is executed.
        /// </param>
        /// <returns>The number of rows affected by the command.</returns>
        public int ExecuteNonQuery(
            string storedProc,
            Action<SqlParameterCollection> paramMapper,
            Action<SqlParameterCollection> returnParameters = null
        )
        {
            SqlCommand cmd = null;
            SqlConnection conn = null;

            try
            {
                using (conn = GetConnection())
                {
                    if (conn != null)
                    {
                        if (conn.State != ConnectionState.Open)
                            conn.Open();

                        cmd = GetCommand(conn, storedProc, paramMapper);

                        if (cmd != null)
                        {
                            int returnValue = cmd.ExecuteNonQuery();

                            if (conn.State != ConnectionState.Closed)
                                conn.Close();

                            returnParameters?.Invoke(cmd.Parameters);

                            return returnValue;
                        }
                    }
                }
            }
            finally
            {
                if (conn != null && conn.State != ConnectionState.Closed)
                    conn.Close();
            }

            return -1;
        }

        #region - Private Methods (Execute, GetCommand) -

        /// <summary>
        /// Creates a new <see cref="SqlConnection"/> using the provided connection string.
        /// </summary>
        /// <returns>An open SQL connection instance.</returns>
        private SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }

        /// <summary>
        /// Creates and configures a <see cref="SqlCommand"/> for a given connection and parameters.
        /// </summary>
        /// <param name="conn">The active SQL connection.</param>
        /// <param name="cmdText">The name of the stored procedure to execute.</param>
        /// <param name="paramMapper">A delegate to map input parameters for the command.</param>
        /// <returns>A configured <see cref="SqlCommand"/> instance.</returns>
        private SqlCommand GetCommand(SqlConnection conn, string cmdText = null, Action<SqlParameterCollection> paramMapper = null)
        {
            SqlCommand cmd = conn?.CreateCommand();

            if (cmd != null)
            {
                if (!string.IsNullOrEmpty(cmdText))
                {
                    cmd.CommandText = cmdText;
                    cmd.CommandType = CommandType.StoredProcedure;
                }

                paramMapper?.Invoke(cmd.Parameters);
            }

            return cmd;
        }

        #endregion
    }
}
