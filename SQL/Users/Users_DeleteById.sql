CREATE PROC [dbo].[Users_DeleteById]
	@UserId int
AS
/*
	DECLARE @UserId int = x
	EXECUTE dbo.Users_DeleteById
		@UserId
*/
BEGIN
	DELETE FROM dbo.Users
	WHERE UserId = @UserId
END;