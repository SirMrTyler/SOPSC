ALTER PROC [dbo].[UserTokens_DeleteByTokenAndDeviceId]
	@Token NVARCHAR(MAX),
	@DeviceId NVARCHAR(MAX)
AS
/* -- TESTING EXEC BLOCK
	DECLARE @UserId INT = 2
	DECLARE
		@Token NVARCHAR(255) = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyIiwidW5pcXVlX25hbWUiOiJzaXJtcnR5bGVyLmJ1c2luZXNzQGdtYWlsLmNvbSIsIm5iZiI6MTczODExNjUwNSwiZXhwIjoxNzM4NzIxMzA1LCJpYXQiOjE3MzgxMTY1MDUsImlzcyI6IlNPUFNDLkFwaSIsImF1ZCI6IlNPUFNDLkFwaS5Vc2VycyJ9.VAzZmlVIabOaPqHe_Tar2MPbMc4eL5fuCrS6KYl53gg'
	DECLARE
		@DeviceId NVARCHAR(100) = N'4941bd16-8f34-43a3-aadb-856d5d947357'

	EXEC dbo.UserTokens_DeleteByTokenAndDeviceId
		@Token,
		@DeviceId
	SELECT * FROM dbo.UserTokens
	WHERE Token = @Token
	*/
BEGIN
	SET NOCOUNT ON;

	DELETE FROM dbo.UserTokens
	WHERE Token = @Token
	AND DeviceId = @DeviceId;
END;