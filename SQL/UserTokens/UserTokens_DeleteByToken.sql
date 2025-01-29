ALTER PROC dbo.UserTokens_DeleteByToken
	@Token NVARCHAR(255)
AS
/* -- TESTING EXEC BLOCK
	DECLARE 
		@Token NVARCHAR(255) = '28DB08E8-5B2A-414A-8281-043D0157A4A8'
	EXEC dbo.UserTokens_DeleteByToken
		@Token

	SELECT
		Token,
		UserId,
		Token
	FROM dbo.UserTokens
	WHERE Token = @Token
*/
BEGIN
	DELETE
	FROM dbo.UserTokens
	WHERE Token = @Token
END