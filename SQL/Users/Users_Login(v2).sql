ALTER PROC [dbo].[Users_Login]
	@Email NVARCHAR(100),
	@Password NVARCHAR(255),
	@DeviceId NVARCHAR(255),
	@Token NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE
		@UserId INT,
		@HashedPassword NVARCHAR(255),
		@FirstName NVARCHAR(50),
		@LastName NVARCHAR(50),
		@RoleId INT,
		@IsActive BIT;

	-- Retrieve user credentials
	SELECT
		@UserId = UserId,
		@FirstName = FirstName,
		@LastName = LastName,
		@HashedPassword = Password,
		@RoleId = RoleId,
		@IsActive = IsActive
	FROM dbo.Users
	WHERE Email = @Email

	-- Check if user exists and password is valid
	IF @UserId IS NULL
	BEGIN
		RAISERROR('Invalid email or password', 16, 1);
		RETURN;
	END

	IF NOT @IsActive = 1
	BEGIN
		RAISERROR('Account is inactive.', 16, 1);
		RETURN;
	END

	SELECT
		@UserId AS UserId,
		@FirstName AS FirstName,
		@LastName AS LastName,
		@HashedPassword AS HashedPassword,
		@RoleId AS RoleId,
		@IsActive AS IsActive
END;