ALTER PROCEDURE [dbo].[UserTokens_DeleteOldTokensByUserId]
    @UserId INT

AS
/* -- TESTING EXEC BLOCK
	DECLARE 
		@UserId INT = 2,  -- Replace with a valid UserId from your database

	EXEC dbo.UserTokens_DeleteOldTokensByUserId 
		@UserId

	-- Check results after execution
	SELECT * 
	FROM UserTokens
	WHERE UserId = @UserId;
*/
BEGIN

	-- Keep only the most recent token
	DECLARE @TokenToKeep INT;
	
	-- Check for non-expiring token(s)
	SELECT TOP 1 @TokenToKeep = TokenId
	FROM dbo.UserTokens
	WHERE UserId = @UserId
	ORDER BY DateCreated DESC;

	-- Delete all old tokens except the newest one
	DELETE FROM dbo.UserTokens
	WHERE UserId = @UserId
	AND TokenId != @TokenToKeep;
END;
