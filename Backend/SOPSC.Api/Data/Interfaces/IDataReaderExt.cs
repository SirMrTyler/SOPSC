using Newtonsoft.Json;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Data.SqlTypes;

namespace SOPSC.Api.Data.Interfaces
{
    /// <summary>
    /// Provides extension methods for the <see cref="IDataReader"/> interface,
    /// enabling safe and convenient retrieval of data from database result sets.
    /// </summary>
    /// <remarks>
    /// The following methods are available ( IDataReader.Method() for more info ):
    /// <list type="bullet">
    ///   <item><c>DeserializeObject</c></item>
    ///   <item><c>GetSafeTYPE</c> - where TYPE = Uri, SqlBytes, Value, Guid, String,Bool, Int32, Int64, Float, Double, Decimal, Enum, DateTime, UtcDateTime, TimeSpan</item>
    ///   <item><c>GetSafeTYPENullable</c> - where TYPE = Guid, Bool, Int32, Int64, DateTime, UtcDateTime, TimeSpan, Float, Double, Decimal, Enum</item>
    /// </list>
    /// </remarks>
    public static class IDataReaderExt
    {
        #region Safe Reference Type Mappers

        /// <summary>
        /// Safely retrieves a string value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <param name="trim">Indicates whether to trim the retrieved string.</param>
        /// <returns>The string value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static string GetSafeString(this IDataReader reader, int ordinal, bool trim = true)
        {
            if (reader[ordinal] != null && reader[ordinal] != DBNull.Value)
            {
                return trim ? reader.GetString(ordinal).Trim() : reader.GetString(ordinal);
            }
            return null;
        }

        /// <summary>
        /// Deserializes a JSON string from the specified column into an object of type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The type to deserialize into.</typeparam>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The deserialized object or default if the column is <c>DBNull</c>.</returns>
        public static T DeserializeObject<T>(this IDataReader reader, int ordinal)
        {
            T result = default;

            if (reader[ordinal] != null && reader[ordinal] != DBNull.Value)
            {
                string json = reader.GetString(ordinal);

                if (!string.IsNullOrEmpty(json))
                {
                    result = JsonConvert.DeserializeObject<T>(json);
                }
            }
            return result;
        }

        /// <summary>
        /// Safely retrieves a <see cref="Uri"/> object from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>A <see cref="Uri"/> object or <c>null</c> if the value is not a valid URI.</returns>
        public static Uri GetSafeUri(this IDataReader reader, int ordinal)
        {
            if (reader[ordinal] != null && reader[ordinal] != DBNull.Value)
            {
                string uriString = reader.GetString(ordinal);
                if (Uri.TryCreate(uriString, UriKind.RelativeOrAbsolute, out Uri uri))
                {
                    return uri;
                }
            }
            return null;
        }

        /// <summary>
        /// Safely retrieves <see cref="SqlBytes"/> from the specified column.
        /// </summary>
        /// <param name="reader">The SQL data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>A <see cref="SqlBytes"/> object or an empty <see cref="SqlBytes"/> if the column is <c>DBNull</c>.</returns>
        public static SqlBytes GetSafeSqlBytes(this SqlDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetSqlBytes(ordinal)
                : new SqlBytes();
        }

        /// <summary>
        /// Safely retrieves an object value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The object value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static object GetSafeValue(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetValue(ordinal)
                : null;
        }

        #endregion Safe Reference Type Mappers

        #region Safe Value Type Mappers

        /// <summary>
        /// Safely retrieves a <see cref="Guid"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The <see cref="Guid"/> value or <see cref="Guid.Empty"/> if the column is <c>DBNull</c>.</returns>
        public static Guid GetSafeGuid(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetGuid(ordinal)
                : Guid.Empty;
        }

        /// <summary>
        /// Safely retrieves a nullable <see cref="Guid"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The nullable <see cref="Guid"/> value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static Guid? GetSafeGuidNullable(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetGuid(ordinal)
                : null;
        }

        /// <summary>
        /// Safely retrieves a boolean value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The boolean value or <c>false</c> if the column is <c>DBNull</c>.</returns>
        public static bool GetSafeBool(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetBoolean(ordinal)
                : false;
        }

        /// <summary>
        /// Safely retrieves a nullable boolean value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The nullable boolean value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static bool? GetSafeBoolNullable(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetBoolean(ordinal)
                : null;
        }

        /// <summary>
        /// Safely retrieves an integer value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The integer value or <c>0</c> if the column is <c>DBNull</c>.</returns>
        public static int GetSafeInt32(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetInt32(ordinal)
                : 0;
        }

        /// <summary>
        /// Safely retrieves a nullable integer value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The nullable integer value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static int? GetSafeInt32Nullable(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetInt32(ordinal)
                : null;
        }

        /// <summary>
        /// Safely retrieves a 64-bit integer value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The 64-bit integer value or <c>0</c> if the column is <c>DBNull</c>.</returns>
        public static long GetSafeInt64(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetInt64(ordinal)
                : 0;
        }

        /// <summary>
        /// Safely retrieves a nullable 64-bit integer value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The nullable 64-bit integer value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static long? GetSafeInt64Nullable(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetInt64(ordinal)
                : null;
        }

        /// <summary>
        /// Safely retrieves a <see cref="DateTime"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The <see cref="DateTime"/> value or default if the column is <c>DBNull</c>.</returns>
        public static DateTime GetSafeDateTime(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetDateTime(ordinal)
                : default;
        }

        /// <summary>
        /// Safely retrieves a UTC <see cref="DateTime"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <param name="kind">The <see cref="DateTimeKind"/> to assign.</param>
        /// <returns>The UTC <see cref="DateTime"/> value or default if the column is <c>DBNull</c>.</returns>
        public static DateTime GetSafeUtcDateTime(this IDataReader reader, int ordinal, DateTimeKind kind = DateTimeKind.Utc)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? DateTime.SpecifyKind(reader.GetDateTime(ordinal), kind)
                : default;
        }

        /// <summary>
        /// Safely retrieves a nullable <see cref="DateTime"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <param name="kind">The <see cref="DateTimeKind"/> to assign.</param>
        /// <returns>The nullable <see cref="DateTime"/> value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static DateTime? GetSafeDateTimeNullable(this IDataReader reader, int ordinal, DateTimeKind kind = DateTimeKind.Utc)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? DateTime.SpecifyKind(reader.GetDateTime(ordinal), kind)
                : null;
        }

        /// <summary>
        /// Safely retrieves a nullable UTC <see cref="DateTime"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The nullable UTC <see cref="DateTime"/> value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static DateTime? GetSafeUtcDateTimeNullable(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? DateTime.SpecifyKind(reader.GetDateTime(ordinal), DateTimeKind.Utc)
                : null;
        }

        /// <summary>
        /// Safely retrieves a <see cref="TimeSpan"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The SQL data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The <see cref="TimeSpan"/> value or default if the column is <c>DBNull</c>.</returns>
        public static TimeSpan GetSafeTimeSpan(this SqlDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetTimeSpan(ordinal)
                : default;
        }

        /// <summary>
        /// Safely retrieves a nullable <see cref="TimeSpan"/> value from the specified column.
        /// </summary>
        /// <param name="reader">The SQL data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The nullable <see cref="TimeSpan"/> value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static TimeSpan? GetSafeTimeSpanNullable(this SqlDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetTimeSpan(ordinal)
                : null;
        }

        /// <summary>
        /// Safely retrieves a float value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The float value or <c>0F</c> if the column is <c>DBNull</c>.</returns>
        public static float GetSafeFloat(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetFloat(ordinal)
                : 0F;
        }

        /// <summary>
        /// Safely retrieves a nullable float value from the specified column.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The nullable float value or <c>null</c> if the column is <c>DBNull</c>.</returns>
        public static float? GetSafeFloatNullable(this IDataReader reader, int ordinal)
        {
            return reader[ordinal] != null && reader[ordinal] != DBNull.Value
                ? reader.GetFloat(ordinal)
                : null;
        }

        /// <summary>
        /// Safely retrieves a non-nullable double value from the data reader.
        /// If the value is null, it returns 0.0.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The ordinal column position.</param>
        /// <returns>The double value or 0.0 if null.</returns>
        public static double GetSafeDouble(this IDataReader reader, int ordinal)
        {
            if (reader[ordinal] != null && reader[ordinal] != DBNull.Value)
            {
                return reader.GetDouble(ordinal);
            }
            else
            {
                return 0;
            }
        }

        /// <summary>
        /// Safely retrieves a nullable double value from the data reader.
        /// If the value is null, it returns null.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The ordinal column position.</param>
        /// <returns>The nullable double value or null if null.</returns>
        public static double? GetSafeDoubleNullable(this IDataReader reader, int ordinal)
        {
            if (reader[ordinal] != null && reader[ordinal] != DBNull.Value)
            {
                return reader.GetDouble(ordinal);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Safely retrieves a non-nullable decimal value from the data reader.
        /// If the value is null, it returns 0.0M.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The ordinal column position.</param>
        /// <returns>The decimal value or 0.0M if null.</returns>
        public static decimal GetSafeDecimal(this IDataReader reader, int ordinal)
        {
            if (reader[ordinal] != null && reader[ordinal] != DBNull.Value)
            {
                return reader.GetDecimal(ordinal);
            }
            else
            {
                return 0M;
            }
        }

        /// <summary>
        /// Safely retrieves a nullable decimal value from the data reader.
        /// If the value is null, it returns null.
        /// </summary>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The ordinal column position.</param>
        /// <returns>The nullable decimal value or null if null.</returns>
        public static decimal? GetSafeDecimalNullable(this IDataReader reader, int ordinal)
        {
            if (reader[ordinal] != null && reader[ordinal] != DBNull.Value)
            {
                return reader.GetDecimal(ordinal);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Safely retrieves an enum value from the specified column, assuming it is stored as a string.
        /// </summary>
        /// <typeparam name="TEnum">The enum type.</typeparam>
        /// <param name="reader">The data reader instance.</param>
        /// <param name="ordinal">The column ordinal.</param>
        /// <returns>The enum value or the default value of <typeparamref name="TEnum"/> if not valid.</returns>
        public static TEnum GetSafeEnum<TEnum>(this IDataReader reader, int ordinal) where TEnum : struct
        {
            string enumValue = null;
            object value = reader.GetSafeValue(ordinal);

            TEnum parsedValue = default;

            if (value == null)
                return parsedValue;

            enumValue = value.ToString();

            if (!string.IsNullOrEmpty(enumValue) && Enum.TryParse(enumValue, true, out parsedValue))
            {
                if (!Enum.IsDefined(typeof(TEnum), parsedValue))
                {
                    parsedValue = default;
                }
            }

            return parsedValue;
        }

        #endregion - Safe Value Type mappers -
    }
}