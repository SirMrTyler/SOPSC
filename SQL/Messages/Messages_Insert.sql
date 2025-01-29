ALTER PROC dbo.Messages_Insert
	@MessageId INT OUTPUT,
	@SenderId INT,
	@RecipientId INT,
	@MessageContent NVARCHAR(MAX)
AS
/* -- Testing Exectution Block
	DECLARE @MessageId INT;
	EXEC dbo.Messages_Insert
		@MessageId OUTPUT,
		@SenderId = 2,
		@RecipientId = 3,
		@MessageContent = 'Hello, this is a test message.';
	SELECT *
	FROM dbo.Messages
	WHERE MessageId = @MessageId;

	-- Used to see all available users and their ID's.
	SELECT *
	FROM dbo.Users;
*/
BEGIN
	INSERT INTO dbo.Messages (
		SenderId,
		RecipientId,
		MessageContent,
		SentTimestamp,
		IsRead)
	VALUES (
		@SenderId,
		@RecipientId,
		@MessageContent,
		SYSDATETIME(),
		0);
	-- Get newley created MessageId
	SET @MessageId = SCOPE_IDENTITY();

	SELECT *
	FROM dbo.Messages
	WHERE MessageId = @MessageId;
END;
