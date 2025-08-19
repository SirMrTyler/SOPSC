ALTER PROC [dbo].[Users_InsertGoogle]
	@FirstName NVARCHAR(100),
	@LastName NVARCHAR(100),
	@Email NVARCHAR(255),
	@ProfilePicturePath NVARCHAR(255),
	@IsGoogleUser BIT,
	@Id INT OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Users
	(
		FirstName,
		LastName,
		Email,
		Password,
		ProfilePicturePath,
		IsGoogleUser,
		IsConfirmed,
		DateCreated,
		LastLoginDate,
		IsActive,
		HoursServed,
		RoleId
	)
	VALUES
	(
		@FirstName,
		@LastName,
		@Email,
		NULL,
		@ProfilePicturePath,
		@IsGoogleUser,
		1,
		GETUTCDATE(),
		GETUTCDATE(),
		1,
		0.00,
		3
	);

	SET @Id = SCOPE_IDENTITY();
END