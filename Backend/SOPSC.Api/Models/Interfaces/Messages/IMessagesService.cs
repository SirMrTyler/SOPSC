using System.Collections.Generic;
using SOPSC.Api.Models.Domains.Messages;

namespace SOPSC.Api.Models.Interfaces.Messages
{
    /// <summary>
    /// Provides message related operations.
    /// </summary>
    public interface IMessagesService
    {
        /// <summary>
        /// Retrieves conversation summaries for a user.
        /// </summary>
        /// <param name="userId">The id of the user.</param>
        /// <returns>List of message conversations.</returns>
        List<MessageConversation> GetConversations(int userId);
    }
}