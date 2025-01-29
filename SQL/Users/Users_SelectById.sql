ALTER PROC [dbo].[Users_SelectById]
	@UserId int

AS
/*
	DECLARE
		@UserId int = 2
	EXECUTE dbo.Users_SelectById
		@UserId
*/
BEGIN
	SELECT [UserId],
		[FirstName],
		[LastName],
		[Email],
		[DateCreated],
		[LastLoginDate],
		[IsActive],
		[RoleId]
	FROM [dbo].[Users]

	WHERE UserId = @UserId

END