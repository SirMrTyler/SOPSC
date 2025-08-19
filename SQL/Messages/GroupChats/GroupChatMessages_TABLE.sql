BEGIN
    CREATE TABLE dbo.GroupChatMessages(
        MessageId INT IDENTITY(1,1) PRIMARY KEY,
        GroupChatId INT NOT NULL,
        SenderId INT NOT NULL,
        MessageContent NVARCHAR(MAX) NOT NULL,
        SentTimestamp DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
        ReadTimestamp DATETIME2(7) NULL
    );
END