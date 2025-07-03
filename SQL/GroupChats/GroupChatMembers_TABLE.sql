BEGIN
    CREATE TABLE dbo.GroupChatMembers(
        GroupChatId INT NOT NULL,
        UserId INT NOT NULL,
        JoinedTimestamp DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
        LastReadTimestamp DATETIME2(7) NULL,
        CONSTRAINT PK_GroupChatMembers PRIMARY KEY (GroupChatId, UserId)
    );
END