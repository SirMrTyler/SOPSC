CREATE PROC dbo.Users_Confirm
	@UserId INT
AS 
/* -- TESTING EXEC BLOCK
	DECLARE 
		@UserId INT = 2
	EXEC dbo.Users_Confirm
		@UserId
	SELECT
		FirstName,
		LastName,
		IsConfirmed
	FROM dbo.Users
	WHERE UserId = @UserId
*/
BEGIN
	DECLARE @True INT = 1

	UPDATE dbo.Users
	SET IsConfirmed = @True
	WHERE UserId = @UserId
END