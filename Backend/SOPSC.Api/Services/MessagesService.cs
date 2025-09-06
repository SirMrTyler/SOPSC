using Microsoft.Data.SqlClient;
using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Domains.Messages;
using SOPSC.Api.Models.Interfaces.Messages;
using System;
using System.Collections.Generic;
using System.Data;

namespace SOPSC.Api.Services
{
    /// <summary>
    /// Service for retrieving messages and conversations.
    /// </summary>
    public class MessagesService : IMessagesService
    {
        private readonly IDataProvider _dataProvider;

        public MessagesService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        /// <inheritdoc />
        public List<MessageConversation> GetConversations(int userId)
        {
            List<MessageConversation> list = null;
            string procName = "[dbo].[Messages_SelectAll]";

            _dataProvider.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@UserId", userId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    MessageConversation mc = new MessageConversation
                    {
                        MessageId = reader.GetSafeInt32(startingIndex++),
                        ChatId = reader.GetSafeInt32(startingIndex++),
                        OtherUserId = reader.GetSafeInt32(startingIndex++),
                        OtherUserName = reader.GetSafeString(startingIndex++),
                        OtherUserProfilePicturePath = reader.GetSafeString(startingIndex++),
                        MostRecentMessage = reader.GetSafeString(startingIndex++),
                        IsRead = reader.GetSafeBool(startingIndex++),
                        SentTimestamp = reader.GetSafeUtcDateTime(startingIndex++),
                        NumMessages = reader.GetSafeInt32(startingIndex++),
                        IsLastMessageFromUser = reader.GetSafeBool(startingIndex++)
                    };

                    if (list == null)
                    {
                        list = new List<MessageConversation>();
                    }
                    list.Add(mc);
                });

            return list;
        }


        public Paged<Message> GetConversationByChatId(int userId, int chatId, int pageIndex, int pageSize)
        {
            List<Message> list = null;
            Paged<Message> pagedList = null;
            int totalCount = 0;
            string procName = "[dbo].[Messages_SelectByChatId]";

            _dataProvider.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@ChatId", chatId);
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    Message message = new Message
                    {
                        MessageId = reader.GetSafeInt32(startingIndex++),
                        ChatId = reader.GetSafeInt32(startingIndex++),
                        SenderId = reader.GetSafeInt32(startingIndex++),
                        SenderName = reader.GetSafeString(startingIndex++),
                        MessageContent = reader.GetSafeString(startingIndex++),
                        SentTimestamp = reader.GetSafeUtcDateTime(startingIndex++),
                        ReadTimestamp = reader.GetSafeUtcDateTimeNullable(startingIndex++),
                        IsRead = reader.GetSafeBool(startingIndex++),
                    };
                    totalCount = reader.GetSafeInt32(startingIndex++);

                    if (list == null)
                    {
                        list = new List<Message>();
                    }
                    list.Add(message);
                });

            if (list != null && list.Count > 0)
            {
                pagedList = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public void UpdateReadStatus(int messageId, bool isRead)
        {
            string procName = "[dbo].[Messages_UpdateReadStatus]";

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@MessageId", messageId);
                    param.AddWithValue("@IsRead", isRead);
                });
        }

        public MessageCreated SendMessage(int senderId, int chatId, int recipientId, string messageContent)
        {
            if (!UserExists(senderId) || !UserExists(recipientId))
            {
                throw new ArgumentException("Sender or recipient does not exist.");
            }

            // Ensure a chat exists between the users
            if (chatId <= 0)
            {
                string chatProc = "[dbo].[ChatLookup_InsertOrGet]";
                _dataProvider.ExecuteNonQuery(chatProc,
                    delegate (SqlParameterCollection param)
                    {
                        SqlParameter chatOut = new SqlParameter("@ChatId", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        param.Add(chatOut);
                        param.AddWithValue("@User1Id", senderId);
                        param.AddWithValue("@User2Id", recipientId);
                    },
                    delegate (SqlParameterCollection returnCollection)
                    {
                        object cId = returnCollection["@ChatId"].Value;
                        int.TryParse(cId.ToString(), out chatId);
                    });
            }

            int messageId = 0;
            string procName = "[dbo].[Messages_Insert]";

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@ChatId", chatId);
                    param.AddWithValue("@SenderId", senderId);
                    param.AddWithValue("@MessageContent", messageContent);

                    SqlParameter idOut = new SqlParameter("@MessageId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    param.Add(idOut);
                },
                delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@MessageId"].Value;
                    int.TryParse(oId.ToString(), out messageId);
                });

            return new MessageCreated { Id = messageId, ChatId = chatId };
        }

        private bool UserExists(int userId)
        {
            bool exists = false;
            string procName = "[dbo].[Users_SelectById]";

            _dataProvider.ExecuteCmd(procName,
                param => { param.AddWithValue("@UserId", userId); },
                delegate (IDataReader reader, short set)
                {
                    exists = true;
                });

            return exists;
        }

        public void DeleteMessages(string messageIds)
        {
            string procName = "[dbo].[Messages_DeleteById]";

            _dataProvider.ExecuteNonQuery(procName,
                param => { param.AddWithValue("@MessageIds", messageIds); });
        }

        public void DeleteConversation(int chatId)
        {
            string procName = "[dbo].[Messages_DeleteConversation]";

            _dataProvider.ExecuteNonQuery(procName,
                param =>
                {
                    param.AddWithValue("@ChatId", chatId);
                });
        }
    }
}