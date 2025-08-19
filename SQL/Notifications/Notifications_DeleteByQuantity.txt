ALTER PROC dbo.Notifications_DeleteByQuantity
AS
/* -- Testing Execution Block
	EXEC dbo.Notifications_DeleteByQuantity;
*/
BEGIN
	-- Delete notifications that have been read for more than 14 days
	DELETE FROM dbo.Notifications
	WHERE IsRead = 1
		AND DATEDIFF(DAY, ReadTimestamp, GETDATE()) > 14;
	DELETE FROM dbo.Notifications
	WHERE IsRead = 0
		AND DATEDIFF(DAY, CreatedTimestamp, GETDATE()) > 30;

	-- Optional: Print message to confirm deletions
	PRINT 'Old notifications deleted successfully.';
END;