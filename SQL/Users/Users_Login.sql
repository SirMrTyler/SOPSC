ALTER PROC dbo.Users_Login
	@Email NVARCHAR(100),
	@Password NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	-- Check if user exists and verify password
	SELECT
		UserId,
		FirstName,
		LastName,
		RoleId,
		IsActive
	FROM dbo.Users
	WHERE Email = @Email AND Password = @Password
END;