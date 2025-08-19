ALTER PROC dbo.Notifications_UpdateReadStatus
	@NotificationId INT
	,@IsRead BIT

AS
/* -- Testing Execution Block
	DECLARE @NotificationId INT = 1;
	DECLARE @IsRead BIT = 0;

	EXEC dbo.Notifications_UpdateReadStatus
		@NotificationId
		,@IsRead;

	SELECT *
	FROM dbo.Notifications
	WHERE NotificationId = @NotificationId
*/
BEGIN
	UPDATE dbo.Notifications
	SET
		IsRead = @IsRead,
		-- If set to read; update timestamp. If set to unread; empty timestamp
		ReadTimestamp = CASE WHEN @IsRead = 1 THEN GETDATE() ELSE NULL END
	WHERE NotificationId = @NotificationId

	-- Check if any rows were affected
	IF @@ROWCOUNT = 0
		RAISERROR('Notification not found', 16, 1, @NotificationId);
	ELSE
		-- Return updated notification for confirmation
		SELECT *
		FROM dbo.Notifications
		WHERE NotificationId = @NotificationId;
END;