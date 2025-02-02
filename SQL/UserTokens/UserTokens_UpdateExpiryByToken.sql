ALTER PROC [dbo].[UserTokens_UpdateExpiryByToken]
	@Token NVARCHAR(MAX),
	@NewExpiryDate DATETIME2(7)

AS
/* -- TESTING EXEC BLOCK
	DECLARE
		@Token NVARCHAR(MAX) = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyIiwidW5pcXVlX25hbWUiOiJzaXJtcnR5bGVyLmJ1c2luZXNzQGdtYWlsLmNvbSIsIm5iZiI6MTczODEwOTg1NCwiZXhwIjoxNzM4NzE0NjU0LCJpYXQiOjE3MzgxMDk4NTQsImlzcyI6IlNPUFNDLkFwaSIsImF1ZCI6IlNPUFNDLkFwaS5Vc2VycyJ9.Uo9L6a1Z47QVmtmxHBGIZcopxmnAJmwBDyPDr1Fd2kY',
		@NewExpiryDate DATETIME2(7);
	
	SELECT *
	FROM dbo.UserTokens
	WHERE @Token = Token;

	EXEC dbo.UserTokens_UpdateExpiryByToken
		@Token,
		@NewExpiryDate;

	SELECT *
	FROM dbo.UserTokens
	WHERE @Token = Token;

*/
BEGIN
	IF @NewExpiryDate IS NULL
	BEGIN
		SET @NewExpiryDate = DATEADD(WEEK, 2, SYSUTCDATETIME());
	END

	UPDATE dbo.UserTokens
	SET ExpiryDate = @NewExpiryDate
	WHERE Token = @Token;
END;