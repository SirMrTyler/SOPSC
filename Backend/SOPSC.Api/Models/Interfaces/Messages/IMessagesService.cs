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

        /// <summary>
        /// Sends a message to another user. If the chat does not exist, it will be created.
        /// </summary>
        /// <param name="senderId">Id of the user sending the message.</param>
        /// <param name="chatId">Existing chat id or 0 to create a new chat.</param>
        /// <param name="recipientId">Id of the recipient user.</param>
        /// <param name="messageContent">Text content of the message.</param>
        /// <returns>The identifiers of the created message and chat.</returns>
        MessageCreated SendMessage(int senderId, int chatId, int recipientId, string messageContent);

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