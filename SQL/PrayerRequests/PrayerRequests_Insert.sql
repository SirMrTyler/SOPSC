ALTER PROC	dbo.PrayerRequests_Insert
	@PrayerId INT OUTPUT,
	@UserId INT,
	@Subject NVARCHAR(50),
	@Body NVARCHAR(MAX),
	@PrayerCount INT = 0
AS
/* -- TESTING EXECUTION BLOCK
	DECLARE @PrayerId INT;
	EXEC dbo.PrayerRequests_Insert
		@PrayerId OUTPUT,
		@UserId = 2,
		@Subject = 'Vigilance',
		@Body = 'Please pray for guidance in these trying times.',
		@PrayerCount = 0;

	SELECT *
	FROM dbo.PrayerRequests
	WHERE PrayerId = @PrayerId;
*/
BEGIN
	DECLARE 
		@NotificationContent NVARCHAR(255),
		@UserName NVARCHAR(100);

	SELECT @UserName = FirstName + ' ' + LastName
	FROM dbo.Users
	WHERE UserId = @UserId;

	INSERT INTO dbo.PrayerRequests
		(UserId,
		Subject,
		Body,
		PrayerCount)
	VALUES
		(@UserId,
		@Subject,
		@Body,
		@PrayerCount);

	SET @PrayerId = SCOPE_IDENTITY();

	-- Create notification content
	SET @NotificationContent = @UserName + ' has added a new prayer request: ' + @Subject;
	INSERT INTO dbo.Notifications
		(NotificationTypeId,
		UserId,
		NotificationContent,
		CreatedTimestamp,
		IsRead)
	SELECT
		7,
		UserId,
		@NotificationContent,
		SYSDATETIME(),
		0 -- Mark as unread
	FROM dbo.Users
	WHERE UserId <> @UserId
	  AND IsActive = 1;
END;