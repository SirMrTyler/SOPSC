ALTER PROC dbo.Messages_DeleteConversation
	@UserId INT,
	@OtherUserId INT
AS
/*-- TESTING EXECUTION BLOCK
	DECLARE @UserId INT = 2;
	DECLARE @OtherUserId INT = 3;
	
	EXEC dbo.Messages_SelectAllInInbox -- Displays current messages in the conversation between users
		@UserId;
	EXEC dbo.Messages_DeleteConversation -- Deletes conversation between users
		@UserId,
		@OtherUserId;
	EXEC dbo.Messages_SelectAllInInbox -- Displays messages after deletion of conversation
		@UserId;
*/
BEGIN
	DELETE FROM dbo.Notifications
	WHERE MessageId IN (
		SELECT MessageId
		FROM dbo.Messages
		WHERE (SenderId = @UserId AND RecipientId = @OtherUserId)
			OR(SenderId = @OtherUserId AND RecipientId = @UserId)
	);

	DELETE FROM dbo.Messages
	WHERE (SenderId = @UserId AND RecipientId = @OtherUserId)
		OR(SenderId = @OtherUserId AND RecipientId = @UserId);
END;