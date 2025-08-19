ALTER PROC [dbo].[Users_Update]
    @UserId INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(255),
    @ProfilePicturePath NVARCHAR(255) = NULL,
    @RoleId INT,
    @AgencyId INT = NULL
AS
BEGIN
    UPDATE dbo.Users
    SET
        FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        ProfilePicturePath = @ProfilePicturePath,
        RoleId = @RoleId,
        AgencyId = @AgencyId
    WHERE UserId = @UserId;
END