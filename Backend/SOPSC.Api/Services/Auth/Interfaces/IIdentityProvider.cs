namespace SOPSC.Api.Services.Auth.Interfaces
{
    /// <summary>
    /// Provides a method to retrieve the current authenticated user's identifier.
    /// </summary>
    /// <typeparam name="T">The type of the user identifier.</typeparam>
    public interface IIdentityProvider<T>
    {
        /// <summary>
        /// Retrieves the unique identifier of the currently authenticated user.
        /// </summary>
        /// <returns>
        /// The identifier of the current user as type <typeparamref name="T"/>.
        /// </returns>
        T GetCurrentUserId();
    }
}
