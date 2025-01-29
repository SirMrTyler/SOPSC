using System.Data;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using SOPSC.Api.Data.Interfaces;

namespace SOPSC.Api.Data
{
    /// <summary>
    /// Provides methods for retrieving and mapping lookup data, including standard and 3-column lookups.
    /// </summary>
    public class LookUpService : ILookUpService
    {
        private readonly IDataProvider _data;

        /// <summary>
        /// Initializes a new instance of the <see cref="LookUpService"/> class with a data provider.
        /// </summary>
        /// <param name="data">An instance of <see cref="IDataProvider"/> to interact with the database.</param>
        public LookUpService(IDataProvider data)
        {
            _data = data;
        }

        /// <summary>
        /// Retrieves a list of lookups for a specified table.
        /// </summary>
        /// <param name="tableName">The name of the database table to fetch lookups from.</param>
        /// <returns>A list of <see cref="LookUp"/> objects representing lookup data.</returns>
        public List<LookUp> GetLookUp(string tableName)
        {
            List<LookUp> list = null;
            string procName = $"dbo.{tableName}_SelectAll";

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LookUp aLookUp = MapSingleLookUp(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<LookUp>();
                    }
                    list.Add(aLookUp);
                });

            return list;
        }

        /// <summary>
        /// Retrieves a list of 3-column lookups for a specified table.
        /// </summary>
        /// <param name="tableName">The name of the database table to fetch 3-column lookups from.</param>
        /// <returns>A list of <see cref="LookUp3Col"/> objects representing 3-column lookup data.</returns>
        public List<LookUp3Col> GetLookUp3Col(string tableName)
        {
            List<LookUp3Col> list = null;
            string procName = $"[dbo].[{tableName}_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LookUp3Col aLookUp = MapSingleLookUp3Col(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<LookUp3Col>();
                    }
                    list.Add(aLookUp);
                });

            return list;
        }

        /// <summary>
        /// Retrieves lookup data for multiple tables and maps them to a dictionary.
        /// </summary>
        /// <param name="tablesNames">An array of table names to retrieve lookup data from.</param>
        /// <returns>
        /// A dictionary where each key is the table name (camel-cased) and the value is a list of <see cref="LookUp"/> objects.
        /// </returns>
        public Dictionary<string, List<LookUp>> GetMany(string[] tablesNames)
        {
            Dictionary<string, List<LookUp>> result = null;

            foreach (string table in tablesNames)
            {
                List<LookUp> currentList = GetLookUp(table);
                string nameToUse = ToCamelCase(table);

                if (result == null)
                {
                    result = new Dictionary<string, List<LookUp>>();
                }
                result.Add(nameToUse, currentList);
            }
            return result;
        }

        /// <summary>
        /// Retrieves 3-column lookup data for multiple tables and maps them to a dictionary.
        /// </summary>
        /// <param name="tablesNames">An array of table names to retrieve 3-column lookup data from.</param>
        /// <returns>
        /// A dictionary where each key is the table name (camel-cased) and the value is a list of <see cref="LookUp3Col"/> objects.
        /// </returns>
        public Dictionary<string, List<LookUp3Col>> GetMany3Col(string[] tablesNames)
        {
            Dictionary<string, List<LookUp3Col>> result = null;

            foreach (string table in tablesNames)
            {
                List<LookUp3Col> currentList = GetLookUp3Col(table);
                string nameToUse = ToCamelCase(table);

                if (result == null)
                {
                    result = new Dictionary<string, List<LookUp3Col>>();
                }
                result.Add(nameToUse, currentList);
            }
            return result;
        }

        /// <summary>
        /// Converts a string to camel case.
        /// </summary>
        /// <param name="str">The string to be converted.</param>
        /// <returns>A camel-cased version of the input string.</returns>
        private static string ToCamelCase(string str)
        {
            string name = null;
            if (str.Length > 0)
            {
                str = Regex.Replace(str, "([A-Z])([A-Z]+)($|[A-Z])",
                    m => m.Groups[1].Value + m.Groups[2].Value.ToLower() + m.Groups[3].Value);
                name = char.ToLower(str[0]) + str.Substring(1);
            }
            return name;
        }

        /// <summary>
        /// Maps a single row from the data reader to a <see cref="LookUp"/> object.
        /// </summary>
        /// <param name="reader">The <see cref="IDataReader"/> containing the data.</param>
        /// <param name="startingIndex">The starting index of the data columns.</param>
        /// <returns>A <see cref="LookUp"/> object populated with data.</returns>
        public LookUp MapSingleLookUp(IDataReader reader, ref int startingIndex)
        {
            LookUp lookUp = new LookUp
            {
                Id = reader.GetSafeInt32(startingIndex++),
                Name = reader.GetSafeString(startingIndex++)
            };

            return lookUp;
        }

        /// <summary>
        /// Maps a single row from the data reader to a <see cref="LookUp3Col"/> object.
        /// </summary>
        /// <param name="reader">The <see cref="IDataReader"/> containing the data.</param>
        /// <param name="startingIndex">The starting index of the data columns.</param>
        /// <returns>A <see cref="LookUp3Col"/> object populated with data.</returns>
        public LookUp3Col MapSingleLookUp3Col(IDataReader reader, ref int startingIndex)
        {
            LookUp3Col lookUp = new LookUp3Col
            {
                Id = reader.GetSafeInt32(startingIndex++),
                Name = reader.GetSafeString(startingIndex++),
                Code = reader.GetSafeString(startingIndex++)
            };

            return lookUp;
        }
    }
}
