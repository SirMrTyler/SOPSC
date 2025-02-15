ALTER PROC [dbo].[UserTokens_Insert]
	@UserId INT, 
	@Token NVARCHAR(MAX),
	@DeviceId NVARCHAR(100)
AS
BEGIN
	INSERT INTO dbo.UserTokens
		(UserId,
		Token,
		DeviceId,
		DateCreated)
	VALUES
		(@UserId,
		@Token,
		@DeviceId,
		SYSUTCDATETIME());
END