ALTER PROC [dbo].[Users_CheckIsGoogleUser]
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ISNULL(IsGoogleUser, 0) AS IsGoogleUser
    FROM dbo.Users
    WHERE Email = @Email;
END
GO