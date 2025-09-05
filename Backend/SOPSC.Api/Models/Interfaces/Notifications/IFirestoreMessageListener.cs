using System.Threading;
using System.Threading.Tasks;

namespace SOPSC.Api.Models.Interfaces.Notifications
{
    /// <summary>
    /// Listens for Firestore message document changes.
    /// </summary>
    public interface IFirestoreMessageListener
    {
        /// <summary>
        /// Begins listening for Firestore document changes.
        /// </summary>
        /// <param name="ct">Cancellation token.</param>
        Task StartAsync(CancellationToken ct);
    }
}
