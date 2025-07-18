ALTER PROC [dbo].[Users_UpdateGoogle]
    @UserId INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @ProfilePicturePath NVARCHAR(255),
	@IsGoogleUser BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Users
    SET
        FirstName = @FirstName,
        LastName = @LastName,
        ProfilePicturePath = @ProfilePicturePath,
		IsGoogleUser = @IsGoogleUser,
        LastLoginDate = GETUTCDATE(),
        IsActive = 1
    WHERE UserId = @UserId;
END
