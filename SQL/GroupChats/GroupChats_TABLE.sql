BEGIN
    CREATE TABLE dbo.GroupChats(
        GroupChatId INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        CreatorId INT NOT NULL,
        CreatedTimestamp DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
    );
END