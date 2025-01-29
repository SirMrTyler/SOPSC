ALTER PROC [dbo].[Roles_SelectRolesAllUsers]
AS
/*
	EXECUTE Roles_SelectRolesAllUsers; -- Returns list of all users along with their roles, sorted by RoleName.
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
	LEFT JOIN dbo.Roles r ON u.RoleId = r.RoleId
	ORDER BY r.RoleName, u.LastName, u.FirstName;
END;