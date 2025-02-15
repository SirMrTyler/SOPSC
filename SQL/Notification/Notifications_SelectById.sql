ALTER PROC dbo.Notifications_SelectById
	@NotificationId INT

AS
/*
-- Testing Execution Block
    -- Change integer to view different Notification
	DECLARE 
		@NotificationId INT = 2;

	-- Exec procedure
    EXEC dbo.Notifications_SelectById
        @NotificationId

	-- Verify notification is marked as read
	SELECT *
	FROM dbo.Notifications
	WHERE NotificationId = @NotificationId;
*/
BEGIN
	UPDATE dbo.Notifications
	SET IsRead = 1,
		ReadTimestamp = SYSDATETIME()
	WHERE NotificationId = @NotificationId;

	SELECT 
        n.NotificationId,
        n.NotificationTypeId,
        nt.NotificationType,
        n.UserId AS ToUserId,
        u.FirstName + ' ' + u.LastName AS ToUserName,
        n.NotificationContent,
        n.CreatedTimestamp,
        n.ReadTimestamp,
        n.IsRead,
        n.MessageId,
        -- Retrieve sender information from Messages table if it’s a message notification
        m.SenderId AS FromUserId,
        s.FirstName + ' ' + s.LastName AS FromUserName,
        CASE 
            WHEN n.MessageId IS NOT NULL THEN m.MessageContent 
            ELSE n.NotificationContent
        END AS FullContent -- Display full message if it's a message notification, else the regular notification content
    FROM dbo.Notifications AS n
    JOIN dbo.Users u ON n.UserId = u.UserId
    LEFT JOIN dbo.NotificationType nt ON n.NotificationTypeId = nt.NotificationTypeId
    LEFT JOIN dbo.Messages m ON n.MessageId = m.MessageId
    LEFT JOIN dbo.Users s ON m.SenderId = s.UserId
    WHERE n.NotificationId = @NotificationId;
		
END;