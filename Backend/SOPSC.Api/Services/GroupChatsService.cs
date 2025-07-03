using Microsoft.Data.SqlClient;
using SOPSC.Api.Data;
using SOPSC.Api.Data.Interfaces;
using SOPSC.Api.Models.Domains.GroupChats;
using SOPSC.Api.Models.Interfaces.GroupChats;
using System.Collections.Generic;
using System.Data;

namespace SOPSC.Api.Services;

/// <summary>
/// Service for group chat related operations.
/// </summary>
public class GroupChatsService : IGroupChatsService
{
    private readonly IDataProvider _dataProvider;

    public GroupChatsService(IDataProvider dataProvider)
    {
        _dataProvider = dataProvider;
    }

    public List<GroupChatSummary> GetByUserId(int userId)
    {
        List<GroupChatSummary> list = null;
        string procName = "[dbo].[GroupChats_SelectByUserId]";

        _dataProvider.ExecuteCmd(procName,
            delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@UserId", userId);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                GroupChatSummary chat = new GroupChatSummary
                {
                    GroupChatId = reader.GetSafeInt32(startingIndex++),
                    Name = reader.GetSafeString(startingIndex++),
                    LastMessage = reader.GetSafeString(startingIndex++),
                    LastSentTimestamp = reader.GetSafeUtcDateTime(startingIndex++),
                    UnreadCount = reader.GetSafeInt32(startingIndex++)
                };

                list ??= new List<GroupChatSummary>();
                list.Add(chat);
            });

        return list;
    }

    public Paged<GroupChatMessage> GetMessages(int groupChatId, int pageIndex, int pageSize)
    {
        List<GroupChatMessage> list = null;
        Paged<GroupChatMessage> pagedList = null;
        int totalCount = 0;
        string procName = "[dbo].[GroupChatMessages_SelectByGroupChatId]";

        _dataProvider.ExecuteCmd(procName,
            delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@GroupChatId", groupChatId);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                GroupChatMessage message = new GroupChatMessage
                {
                    MessageId = reader.GetSafeInt32(startingIndex++),
                    GroupChatId = reader.GetSafeInt32(startingIndex++),
                    SenderId = reader.GetSafeInt32(startingIndex++),
                    SenderName = reader.GetSafeString(startingIndex++),
                    MessageContent = reader.GetSafeString(startingIndex++),
                    SentTimestamp = reader.GetSafeUtcDateTime(startingIndex++),
                    ReadTimestamp = reader.GetSafeUtcDateTimeNullable(startingIndex++)
                };
                totalCount = reader.GetSafeInt32(startingIndex++);
                list ??= new List<GroupChatMessage>();
                list.Add(message);
            });

        if (list != null && list.Count > 0)
        {
            pagedList = new Paged<GroupChatMessage>(list, pageIndex, pageSize, totalCount);
        }

        return pagedList;
    }

    public int Create(int creatorId, string name, List<int> memberIds)
    {
        int id = 0;
        string procName = "[dbo].[GroupChats_Insert]";

        _dataProvider.ExecuteNonQuery(procName,
            delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@CreatorId", creatorId);
                param.AddWithValue("@Name", name);
                param.AddWithValue("@MemberIds", string.Join(",", memberIds));

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                param.Add(idOut);
            },
            delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });

        return id;
    }

    public int SendMessage(int groupChatId, int senderId, string messageContent)
    {
        int messageId = 0;
        string procName = "[dbo].[GroupChatMessages_Insert]";

        _dataProvider.ExecuteNonQuery(procName,
            delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@GroupChatId", groupChatId);
                param.AddWithValue("@SenderId", senderId);
                param.AddWithValue("@MessageContent", messageContent);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                param.Add(idOut);
            },
            delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out messageId);
            });

        return messageId;
    }

    public void AddMembers(int groupChatId, List<int> memberIds)
    {
        string procName = "[dbo].[GroupChatMembers_Insert]";

        _dataProvider.ExecuteNonQuery(procName,
            delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@GroupChatId", groupChatId);
                param.AddWithValue("@MemberIds", string.Join(",", memberIds));
            });
    }
}