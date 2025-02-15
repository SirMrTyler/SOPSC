ALTER PROCEDURE [dbo].[UserTokens_SelectValidByUserId]
    @UserId INT
AS
/* -- TESTING EXEC BLOCK
	DECLARE
		@UserId INT = 2;
	EXEC UserTokens_SelectValidByUserId
		@UserId;
*/
BEGIN
    SELECT TOP 1 *
    FROM UserTokens
    WHERE UserId = @UserId
    ORDER BY DateCreated DESC;
END
