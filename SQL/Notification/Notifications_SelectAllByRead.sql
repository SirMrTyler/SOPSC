ALTER PROC dbo.Notifications_SelectAllByRead
	@IsRead BIT
	,@UserId INT
AS
/* -- Testing Execution Block
	DECLARE
		@IsRead BIT = 1 --Unread = 0, Read = 1
		,@UserId INT = 2 -- Input UserId for user you want to search notifications for
	EXEC dbo.Notifications_SelectAllByRead
		@IsRead
		,@UserId

*/
BEGIN
	SELECT
		NotificationId
		,CreatedTimestamp
		,NotificationContent
	FROM dbo.Notifications
	WHERE IsRead = @IsRead AND UserId = @UserId
	ORDER BY CreatedTimestamp DESC
END