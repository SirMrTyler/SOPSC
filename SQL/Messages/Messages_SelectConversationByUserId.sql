ALTER PROC dbo.Messages_SelectConversationByUserId
	@UserId INT,		-- ID of logged-in user
	@OtherUserId INT	-- ID of user they are having conversation with
AS
/* -- TESTING EXECUTION BLOCK
	DECLARE @UserId INT = 2;
	DECLARE @OtherUserId INT = 3;

	EXEC dbo.Messages_SelectConversationByUserId
		@UserId,
		@OtherUserId;
*/
BEGIN
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
		m.IsRead
	FROM dbo.Messages AS m
	JOIN dbo.Users AS s ON m.SenderId = s.UserId
	JOIN dbo.Users AS r ON m.RecipientId = r.UserId
	WHERE (m.SenderId = @UserId AND m.RecipientId = @OtherUserId)
		OR(m.SenderId = @OtherUserId AND m.RecipientId = @UserId)
	ORDER BY m.SentTimestamp ASC; -- Chronological order
END;