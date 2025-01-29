ALTER PROC dbo.PrayerRequests_UpdateById
	@PrayerId INT,
	@UserId INT,
	@NewSubject NVARCHAR(50),
	@NewBody NVARCHAR(MAX)
AS
/* -- TESTING EXECUTION BLOCK
	DECLARE
		@PrayerId INT = 1,
		@UserId INT = 2,
		@NewSubject NVARCHAR(50) = 'Updated Vigilance',
		@NewBody NVARCHAR(MAX) = 'Updated prayer request content';

	EXEC dbo.PrayerRequests_UpdateById
		@PrayerId,
		@UserId,
		@NewSubject,
		@NewBody;
*/
BEGIN
	DECLARE
		@OriginalPoster INT,
		@RoleId INT;

	-- Get UserId of op, and RoleId of requesting user
	SELECT
		@OriginalPoster = UserId
	FROM dbo.PrayerRequests
	WHERE PrayerId = @PrayerId;

	SELECT
		@RoleId = RoleId
	FROM dbo.Users
	WHERE UserId = @UserId;

	-- validate permissions
	IF (@OriginalPoster <> @UserId AND @RoleId <> 1)
	BEGIN
		RAISERROR('Permission Denied.', 16, 1);
		RETURN;
	END;

	-- Perform update
	UPDATE dbo.PrayerRequests
	SET
		Subject = @NewSubject,
		Body = @NewBody
	WHERE PrayerId = @PrayerId;

	-- Return updated record
	SELECT *
	FROM dbo.PrayerRequests
	WHERE PrayerId = @PrayerId;
END;