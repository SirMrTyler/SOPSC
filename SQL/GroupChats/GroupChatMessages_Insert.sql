ALTER PROC dbo.GroupChatMessages_Insert
        @Id INT OUTPUT,
        @GroupChatId INT,
        @SenderId INT,
        @MessageContent NVARCHAR(MAX)
AS
BEGIN
        INSERT INTO dbo.GroupChatMessages (
                GroupChatId,
                SenderId,
                MessageContent,
                SentTimestamp)
        VALUES (
                @GroupChatId,
                @SenderId,
                @MessageContent,
                SYSDATETIME());
        SET @Id = SCOPE_IDENTITY();

        UPDATE dbo.GroupChatMembers
        SET LastReadTimestamp = SYSDATETIME()
        WHERE GroupChatId = @GroupChatId AND UserId = @SenderId;

        SELECT MessageId, GroupChatId, SenderId, MessageContent, SentTimestamp
        FROM dbo.GroupChatMessages
        WHERE MessageId = @Id;
END