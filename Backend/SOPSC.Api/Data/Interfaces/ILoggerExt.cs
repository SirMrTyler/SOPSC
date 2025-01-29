namespace SOPSC.Api.Data.Interfaces
{
    /// <summary>
    /// Summary:
    ///     A generic interface for logging where the category name is derived from the specified
    ///     TCategoryName type name. Generally used to enable activation of a named Microsoft.Extensions.Logging.ILogger
    ///     from dependency injection.
    ///
    /// Type parameters:
    ///   TCategoryName:
    ///     The type whose name is used for the logger category name.
    public interface ILoggerExt<out TCategoryName> : ILogger
    {
    }
}
