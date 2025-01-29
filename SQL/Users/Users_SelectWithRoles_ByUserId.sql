ALTER PROC dbo.Users_SelectWithRoles_ByUserId
	@UserId INT
AS
/* -- TESTING EXEC BLOCK
	DECLARE
		@UserId int = 2
	EXEC dbo.Users_SelectWithRoles_ByUserId
		@UserId
*/
BEGIN
	-- User Details
	SELECT
		u.UserId,
		u.FirstName,
		u.LastName,
		u.Email,
		u.ProfilePicturePath,
		u.IsActive,
		r.RoleName
	FROM Users u
	INNER JOIN
		Roles r ON u.RoleId = r.RoleId
	WHERE UserId = @UserId;
END;