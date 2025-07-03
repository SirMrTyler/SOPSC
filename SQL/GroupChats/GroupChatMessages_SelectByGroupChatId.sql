ALTER PROC dbo.GroupChatMessages_SelectByGroupChatId
        @GroupChatId INT,
        @PageIndex INT,
        @PageSize INT
AS
BEGIN
        DECLARE @Offset INT = @PageIndex * @PageSize;

        SELECT
                gm.MessageId,
                gm.GroupChatId,
                gm.SenderId,
                u.FirstName + ' ' + u.LastName AS SenderName,
                gm.MessageContent,
                gm.SentTimestamp,
                gm.ReadTimestamp,
                COUNT(1) OVER() AS TotalCount
        FROM dbo.GroupChatMessages gm
        JOIN dbo.Users u ON gm.SenderId = u.UserId
        WHERE gm.GroupChatId = @GroupChatId
        ORDER BY gm.SentTimestamp ASC
        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

        UPDATE dbo.GroupChatMembers
        SET LastReadTimestamp = SYSDATETIME()
        WHERE GroupChatId = @GroupChatId AND UserId IN (
                SELECT UserId FROM dbo.GroupChatMembers WHERE GroupChatId = @GroupChatId
        );
END