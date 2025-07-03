ALTER PROC dbo.GroupChatMembers_Insert
        @GroupChatId INT,
        @MemberIds NVARCHAR(MAX)
AS
BEGIN
    IF @MemberIds IS NOT NULL AND LEN(@MemberIds) > 0
    BEGIN
            INSERT INTO dbo.GroupChatMembers (GroupChatId, UserId)
            SELECT @GroupChatId, TRY_CAST(value AS INT)
            FROM STRING_SPLIT(@MemberIds, ',')
            WHERE TRY_CAST(value AS INT) IS NOT NULL
                    AND NOT EXISTS (
                            SELECT 1 FROM dbo.GroupChatMembers gcm
                            WHERE gcm.GroupChatId = @GroupChatId
                                AND gcm.UserId = TRY_CAST(value AS INT)
                    );
    END
END
GO