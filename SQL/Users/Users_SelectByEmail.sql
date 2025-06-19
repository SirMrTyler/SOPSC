ALTER PROC [dbo].[Users_SelectByEmail]
	@Email NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		UserId
	FROM
		Users
	WHERE
		Email = @Email
END