ALTER PROC [dbo].[Roles_SelectUserRolesById]
	@UserId INT -- ID of user whose role you want to retrieve
AS
/*
	DECLARE @UserId INT = 2 -- UserId of user you want to view role information
	EXECUTE dbo.Roles_SelectUserRolesById
		@UserId = @UserId;
*/
BEGIN
	SELECT
		u.UserId,
		u.FirstName,
		u.LastName,
		u.Email,
		u.DateCreated,
		r.RoleId,
		r.RoleName
	FROM
		dbo.Users u
	JOIN
		dbo.Roles r ON u.RoleId = r.RoleId
	WHERE
		u.UserId = @UserId;
END;