ALTER PROC [dbo].[Users_Select_AuthData]
	@Email nvarchar(100)
	
AS
/*-- TESTING EXECUTION BLOCK
	DECLARE 
		@Email nvarchar(255) = 'sirmrtyler.business@gmail.com'
	EXEC dbo.Users_Select_AuthData 
		@Email
*/
BEGIN
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT	
		Password,
		UserId,
		RoleId
	FROM	dbo.Users
	WHERE	Email = @Email;
END
