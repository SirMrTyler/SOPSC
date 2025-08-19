ALTER PROC dbo.GroupChats_Insert
        @Id INT OUTPUT,
        @CreatorId INT,
        @Name NVARCHAR(100),
        @MemberIds NVARCHAR(MAX)
AS
BEGIN
        INSERT INTO dbo.GroupChats (Name, CreatorId, CreatedTimestamp)
        VALUES (@Name, @CreatorId, SYSDATETIME());
        SET @Id = SCOPE_IDENTITY();

        INSERT INTO dbo.GroupChatMembers (GroupChatId, UserId)
        VALUES (@Id, @CreatorId);

        IF @MemberIds IS NOT NULL AND LEN(@MemberIds) > 0
        BEGIN
                INSERT INTO dbo.GroupChatMembers (GroupChatId, UserId)
                SELECT @Id, TRY_CAST(value AS INT)
                FROM STRING_SPLIT(@MemberIds, ',')
                WHERE TRY_CAST(value AS INT) IS NOT NULL;
        END

        SELECT GroupChatId, Name, CreatorId, CreatedTimestamp
        FROM dbo.GroupChats
        WHERE GroupChatId = @Id;
END