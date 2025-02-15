ALTER PROC [dbo].[UserTokens_SelectByToken]
	@Token NVARCHAR(MAX)
AS
/* -- TESTING EXEC BLOCK
	DECLARE
		@Token NVARCHAR(255) = '182A38E4-C6F0-4E3A-8868-A004A549FDD7'
	EXEC
		@Token
*/
BEGIN
	SELECT 
		TokenId,
		UserId,
		Token,
		DeviceId,
		DateCreated
	FROM dbo.UserTokens
	WHERE Token = @Token;
END