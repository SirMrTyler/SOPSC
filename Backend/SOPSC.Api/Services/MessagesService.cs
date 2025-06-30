using Microsoft.Data.SqlClient;
using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Domains.Messages;
using SOPSC.Api.Models.Interfaces.Messages;
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
                        OtherUserId = reader.GetSafeInt32(startingIndex++),
                        OtherUserName = reader.GetSafeString(startingIndex++),
                        OtherUserProfilePicturePath = reader.GetSafeString(startingIndex++),
                        MostRecentMessage = reader.GetSafeString(startingIndex++),
                        IsRead = reader.GetSafeBool(startingIndex++),
                        SentTimestamp = reader.GetSafeUtcDateTime(startingIndex++),
                        NumMessages = reader.GetSafeInt32(startingIndex++)
                    };

                    if (list == null)
                    {
                        list = new List<MessageConversation>();
                    }
                    list.Add(mc);
                });

            return list;
        }


        public Paged<Message> GetConversationByUserId(int userId, int otherUserId, int pageIndex, int pageSize)
        {
            List<Message> list = null;
            Paged<Message> pagedList = null;
            int totalCount = 0;
            string procName = "[dbo].[Messages_SelectConversationByUserId]";

            _dataProvider.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@OtherUserId", otherUserId);
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    Message message = new Message
                    {
                        MessageId = reader.GetSafeInt32(startingIndex++),
                        SenderId = reader.GetSafeInt32(startingIndex++),
                        SenderName = reader.GetSafeString(startingIndex++),
                        RecipientId = reader.GetSafeInt32(startingIndex++),
                        RecipientName = reader.GetSafeString(startingIndex++),
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

        public int SendMessage(int senderId, int recipientId, string messageContent)
        {
            int messageId = 0;
            string procName = "[dbo].[Messages_Insert]";

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@SenderId", senderId);
                    param.AddWithValue("@RecipientId", recipientId);
                    param.AddWithValue("@MessageContent", messageContent);

                    SqlParameter idOut = new SqlParameter("@MessageId", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    param.Add(idOut);
                },
                delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@MessageId"].Value;
                    int.TryParse(oId.ToString(), out messageId);
                });

            return messageId;
        }
    }
}