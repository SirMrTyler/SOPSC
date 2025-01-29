ALTER PROC [dbo].[Users_Select_AuthData]
	@Email nvarchar(255)
	
AS
/*-- TESTING EXECUTION BLOCK
	DECLARE 
		@Email nvarchar(255) = 'sirmrtyler.business@gmail.com'
	EXEC dbo.Users_Select_AuthData 
		@Email
*/
BEGIN

DECLARE @UserId int = (SELECT UserId from dbo.Users WHERE Email = @Email)

    -- Insert statements for procedure here
	SELECT	
		Password,
		UserId,
		IsConfirmed
	FROM	dbo.Users
	WHERE	UserId = @UserId
	GROUP BY	Password,
				UserId,
				IsConfirmed

	SELECT 
		r.RoleName AS Role
	FROM		dbo.Roles r
	INNER JOIN	dbo.Users u ON r.RoleId = u.RoleId
	WHERE		u.UserId = @UserId
END
GO
