ALTER PROCEDURE [dbo].[Users_SetIsActive]	
	@UserId int,
	@IsActive BIT
	
AS

/*-- TESTING EXECUTION BLOCK
	DECLARE 
		@UserId INT = 2
		@IsActive BIT = 1
	EXEC dbo.Users_UpdateIsActive 
		@UserId
		@IsActive
	SELECT FirstName
			,Lastname
			,IsActive
	FROM dbo.Users
	WHERE UserId = @UserId
*/

BEGIN
	UPDATE	dbo.Users
	SET 
		IsActive = @IsActive,
		LastLoginDate = CASE
			WHEN @IsActive = 1 THEN GETUTCDATE()
			ELSE LastLoginDate
		END
	WHERE	UserId = @UserId
END
