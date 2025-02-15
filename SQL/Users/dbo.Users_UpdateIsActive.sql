ALTER PROCEDURE [dbo].[Users_UpdateIsActive]	
	@UserId int
	
AS

/*-- TESTING EXECUTION BLOCK
	DECLARE @UserId INT = 2

	EXEC dbo.Users_UpdateIsActive 
		@UserId

	SELECT FirstName
			,Lastname
			,IsActive
	FROM dbo.Users
	WHERE UserId = @UserId
*/

BEGIN
	UPDATE	dbo.Users
	SET		
	IsActive = CASE
				WHEN IsActive = 1 THEN 0
				ELSE 1
			   END
	WHERE	UserId = @UserId

END
GO
