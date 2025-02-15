ALTER PROC [dbo].[UserTokens_CheckIfValid]
	@Token NVARCHAR(MAX),
	@DeviceId NVARCHAR(100)
AS
/* --TESTING EXEC BLOCK
	DECLARE
		@Token NVARCHAR(MAX) = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyIiwidW5pcXVlX25hbWUiOiJzaXJtcnR5bGVyLmJ1c2luZXNzQGdtYWlsLmNvbSIsIm5iZiI6MTczODA5OTU4OSwiZXhwIjoxNzM4NzA0Mzg5LCJpYXQiOjE3MzgwOTk1ODksImlzcyI6IlNPUFNDLkFwaSIsImF1ZCI6IlNPUFNDLkFwaS5Vc2VycyJ9.Q91yRKnikk_XVdGn_03qRwzp5mLn2RbCFBxSB7crORg',
		@DeviceId NVARCHAR(100) = '060ed5a7-4cde-4cbe-9181-4c44172d4ac1';
	EXEC dbo.UserTokens_CheckIfValid
		@Token,
		@DeviceId;
*/
BEGIN
	SELECT CASE WHEN COUNT(1) > 0 
				THEN CAST(1 AS BIT) 
			 ELSE CAST(0 AS BIT) 
		END AS IsValidSession
	FROM dbo.UserTokens
	WHERE Token = @Token
	AND DeviceId = @DeviceId;
END;