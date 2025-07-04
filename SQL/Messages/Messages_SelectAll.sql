ALTER PROC [dbo].[Messages_SelectAll]
	@UserId INT
AS
/* -- TESTING EXECUTION BLOCK
	DECLARE @UserId INT = 2;

	EXEC dbo.Messages_SelectAllInInbox
		@UserId;
*/
BEGIN
	SELECT
		LatestMessages.MessageId,

		-- Get user id of the other user
		CASE
			WHEN LatestMessages.SenderId = @UserId THEN LatestMessages.RecipientId
			ELSE LatestMessages.SenderId
		END AS OtherUserId,

		-- Get Name of the other user
		CASE
			WHEN LatestMessages.SenderId = @UserId THEN RecipientUser.FirstName + ' ' + RecipientUser.LastName
			ELSE SenderUser.FirstName + ' ' + SenderUser.LastName
		END AS OtherUserName,

		-- Get profile picture of the other user
		CASE
			WHEN LatestMessages.SenderId = @UserId THEN RecipientUser.ProfilePicturePath
			ELSE SenderUser.ProfilePicturePath
		END AS OtherUserProfilePicturePath,

		-- Get truncated message content to display as a preview
		LEFT(LatestMessages.MessageContent, 50) + 
			CASE 
				WHEN LEN(LatestMessages.MessageContent) > 50 
				THEN '...' 
				ELSE '' 
			END AS MostRecentMessage,

		-- Get read reciepts/time stamps
		LatestMessages.IsRead,
		LatestMessages.SentTimestamp,
		ISNULL(UnreadMessages.NumMessages, 0) AS NumMessages,
		CASE
			WHEN LatestMessages.SenderId = @UserId THEN CAST(1 AS BIT)
			ELSE CAST(0 AS BIT)
        END AS IsLastMessageFromUser
	FROM (
		-- Subquery to determine most recent message in each conversation
		SELECT
			ROW_NUMBER() OVER (PARTITION BY
				CASE
					WHEN SenderId = @UserId THEN RecipientId
					ELSE SenderId
				END
				ORDER BY SentTimestamp DESC) AS RowNum,
				*
			FROM dbo.Messages
			WHERE SenderId = @UserId OR RecipientId = @UserId -- Only include messages where user is the sender/reciever
	) AS LatestMessages
	-- Join to get details of the sender
	LEFT JOIN dbo.Users AS SenderUser ON LatestMessages.SenderId = SenderUser.UserId
	-- Join to get details of recipient
	LEFT JOIN dbo.Users AS RecipientUser ON LatestMessages.RecipientId = RecipientUser.UserId
	-- Join Subquery to calculate how many unread messages in each conversation
	LEFT JOIN (
		SELECT
			-- If user was sender then return the recipient, and vice versa.
			CASE
				WHEN SenderId = @UserId THEN RecipientId
				ELSE SenderId
			END AS OtherUserId,
			-- Count unread messages where user is the recipient
			COUNT(*) AS NumMessages
		FROM dbo.Messages
		 -- Only count messages received by current user
		WHERE IsRead = 0 AND RecipientId = @UserId
		GROUP BY
			CASE
				WHEN SenderId = @UserId THEN RecipientId
				ELSE SenderId
			END
	) AS UnreadMessages ON
		UnreadMessages.OtherUserId = 
		CASE
			WHEN LatestMessages.SenderId = @UserId THEN LatestMessages.RecipientId
			ELSE LatestMessages.SenderId
		END
	-- Include only the most recent message for each conversation
	WHERE LatestMessages.RowNum = 1
	-- Sort conversations by the timestamp of the most recent message
	ORDER BY LatestMessages.SentTimestamp DESC;
END;