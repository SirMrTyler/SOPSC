ALTER PROC dbo.GroupChatMembers_SelectByGroupChatId
        @GroupChatId INT
AS
BEGIN
        SELECT gm.UserId,
               u.FirstName,
               u.LastName,
               u.RoleId
        FROM dbo.GroupChatMembers gm
        JOIN dbo.Users u ON gm.UserId = u.UserId
        WHERE gm.GroupChatId = @GroupChatId;
END