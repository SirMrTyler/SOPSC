using SOPSC.Api.Data;
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
        Paged<Message> GetConversationByChatId(int userId, int chatId, int pageIndex, int pageSize);
        void UpdateReadStatus(int messageId, bool isRead);
        int SendMessage(int senderId, int chatId, string messageContent);

        /// <summary>
        /// Deletes messages by their ids.
        /// </summary>
        /// <param name="messageIds">Comma separated list of message ids.</param>
        void DeleteMessages(string messageIds);

        /// <summary>
        /// Deletes an entire conversation by chat id.
        /// </summary>
        void DeleteConversation(int chatId);
    }
}