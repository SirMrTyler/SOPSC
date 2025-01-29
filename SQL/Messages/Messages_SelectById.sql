ALTER PROC dbo.Messages_SelectById
	@MessageId INT
AS
/* -- TESTING EXECUTION BLOCK
	DECLARE @MessageId INT = 1; -- Replace with actual MessageId

	EXEC dbo.Messages_SelectById
		@MessageId;
*/
BEGIN
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
	WHERE m.MessageId = @MessageId;
END;