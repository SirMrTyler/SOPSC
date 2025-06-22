ALTER PROC Roles_SelectAllUsersByRole
	@RoleId INT -- Id of role for which you want to select Users
AS
/*
	DECLARE @RoleId INT = 1; -- All users with admin role
        DECLARE @RoleId INT = 2; -- All users with admin role
	EXECUTE Roles_SelectAllUsersByRole
		@RoleId = @RoleId;
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
	FROM dbo.Users u
	JOIN dbo.Roles r ON u.RoleId = r.RoleId
	WHERE u.RoleId = @RoleId
	ORDER BY
		u.LastName, u.FirstName;
END;