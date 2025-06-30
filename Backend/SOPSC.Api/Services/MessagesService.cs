using Microsoft.Data.SqlClient;
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
                        SentTimestamp = reader.GetSafeDateTime(startingIndex++),
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
    }
}