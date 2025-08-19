ALTER PROC dbo.GroupChats_SelectByUserId
        @UserId INT
AS
BEGIN
        SELECT
                gc.GroupChatId,
                gc.Name,
                ISNULL(lm.MessageContent, '') AS LastMessage,
                ISNULL(lm.SentTimestamp, SYSDATETIME()) AS LastSentTimestamp,
                COUNT(CASE WHEN gcm.SentTimestamp > ISNULL(m.LastReadTimestamp, '1900-01-01') AND gcm.SenderId <> @UserId THEN 1 END) AS UnreadCount
        FROM dbo.GroupChatMembers m
        JOIN dbo.GroupChats gc ON gc.GroupChatId = m.GroupChatId
        OUTER APPLY (
                SELECT TOP 1 MessageContent, SentTimestamp
                FROM dbo.GroupChatMessages
                WHERE GroupChatId = gc.GroupChatId
                ORDER BY SentTimestamp DESC
        ) lm
        LEFT JOIN dbo.GroupChatMessages gcm ON gcm.GroupChatId = gc.GroupChatId
        WHERE m.UserId = @UserId
        GROUP BY gc.GroupChatId, gc.Name, lm.MessageContent, lm.SentTimestamp, m.LastReadTimestamp;
END