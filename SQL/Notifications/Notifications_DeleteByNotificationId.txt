ALTER PROC dbo.Notifications_DeleteByNotificationId
	@NotificationId INT

AS
/* -- Testing Exectution Block
	DECLARE @NotificationId INT = 2;

	EXEC dbo.Notifications_DeleteByNotificationId
		@NotificationId;

	SELECT *
	FROM dbo.Notifications
*/
BEGIN
	IF EXISTS (SELECT 1 FROM dbo.Notifications WHERE NotificationId = @NotificationId)
	BEGIN
		-- Delete notification
		DELETE FROM dbo.Notifications
		WHERE NotificationId = @NotificationId

		-- Return confirmation
		PRINT 'Notification deleted successfully.';
	END
	ELSE
	BEGIN
		-- Raise error if notification doesn't exists
		RAISERROR('Notification does not exist', 16, 1, @NotificationId);
	END
END;