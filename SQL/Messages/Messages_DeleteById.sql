ALTER PROC dbo.Messages_DeleteById
	@MessageIds NVARCHAR(MAX) -- A comma-sperated string of message IDs to delete
AS
/* -- TESTING EXECUTION BLOCK
	DECLARE @MessageIds NVARCHAR(MAX) = '13,14'; -- Example message IDs to delete
	DECLARE @UserId INT = 2;

	EXEC dbo.Messages_SelectAllInInbox
		@UserId;
	EXEC dbo.Messages_DeleteById
		@MessageIds;
	EXEC dbo.Messages_SelectAllInInbox
		@UserId;

*/
BEGIN
	DECLARE @MessageIdTable TABLE (MessageId INT);
	INSERT INTO @MessageIdTable (MessageId)
	SELECT VALUE
	FROM STRING_SPLIT(@MessageIds, ','); -- Split MessageIds into individual values

	-- Delete notifications tied to the selected messages
	DELETE FROM dbo.Notifications
	WHERE MessageId IN (SELECT MessageId FROM @MessageIdTable);

	-- Delete the messages themselves
	DELETE FROM dbo.Messages
	WHERE MessageId IN (SELECT MessageId FROM @MessageIdTable);
END;