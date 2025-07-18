ALTER PROC [dbo].[Messages_SelectConversationByUserId]
        @UserId INT,
        @OtherUserId INT,
        @PageIndex INT,
        @PageSize INT
AS
BEGIN
	DECLARE @Offset INT = @PageIndex * @PageSize;
        UPDATE dbo.Messages
        SET
                IsRead = 1,
                ReadTimestamp = SYSDATETIME()
        WHERE RecipientId = @UserId
                AND SenderId = @OtherUserId
                AND IsRead = 0; -- Only update if not already read
        SELECT
                m.MessageId,
                m.SenderId,
                s.FirstName + ' ' + s.LastName AS SenderName,
                m.RecipientId,
                r.FirstName + ' ' + r.LastName AS RecipientName,
                m.MessageContent,
                m.SentTimestamp,
                m.ReadTimestamp,
                m.IsRead,
                COUNT(1) OVER() AS TotalCount
        FROM dbo.Messages AS m
        JOIN dbo.Users AS s ON m.SenderId = s.UserId
        JOIN dbo.Users AS r ON m.RecipientId = r.UserId
        WHERE (m.SenderId = @UserId AND m.RecipientId = @OtherUserId)
                OR (m.SenderId = @OtherUserId AND m.RecipientId = @UserId)
        ORDER BY m.SentTimestamp ASC
        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END;