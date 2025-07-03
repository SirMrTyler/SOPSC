using System.Collections.Generic;
using SOPSC.Api.Data;
using SOPSC.Api.Models.Domains.GroupChats;

namespace SOPSC.Api.Models.Interfaces.GroupChats;

public interface IGroupChatsService
{
    List<GroupChatSummary> GetByUserId(int userId);
    Paged<GroupChatMessage> GetMessages(int groupChatId, int pageIndex, int pageSize);
    int Create(int creatorId, string name, List<int> memberIds);
    int SendMessage(int groupChatId, int senderId, string messageContent);
}