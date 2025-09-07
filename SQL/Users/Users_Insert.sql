ALTER PROC [dbo].[Users_Insert]
        (@UserId INT OUTPUT
        ,@FirstName NVARCHAR(50)
        ,@LastName NVARCHAR(50)
        ,@Email NVARCHAR(100)
        ,@Password NVARCHAR(255)
		,@RoleId INT			= 4	-- defaults to "Guest"
		,@DivisionId INT		= 5	-- defaults to 'Unassigned'.
		,@IsConfirmed BIT		= 0 -- pending admin approval
		,@FirebaseUid NVARCHAR(128) = NULL)
AS
/* 
-- SELECT Statement Example:
-- Uncomment and customize the following block to run a test insert and select inserted user

	DECLARE @UserId int = 1 --Change x to id you want to select

	DECLARE
		@FirstName NVARCHAR(50) = 'Tyler',
		@LastName NVARCHAR(50) = 'Klein',
		@Email NVARCHAR(100) = 'sirmrtyler.business@gmail.com',
		@Password NVARCHAR(255) = '!LonxPrince1!',
		@IsConfirmed BIT = 0,
		@RoleId INT = 1, -- 1 represents developer role
		@DivisionId INT = 1;
	EXECUTE dbo.Users_Insert
		@UserId OUTPUT,
		@FirstName,
		@LastName,
		@Email,
		@Password,
		@IsOnline,
		@RoleId,
		@DivisionId

	SELECT *
	FROM dbo.Users
	WHERE UserId = @UserId;
*/
BEGIN
	DECLARE
        @LastLoginDate DATETIME2(7) = GETDATE();

    INSERT INTO dbo.Users
        (FirstName, LastName, Email, Password,
        LastLoginDate, IsOnline, RoleId, IsConfirmed)
    VALUES
        (@FirstName, @LastName, @Email, @Password,
        @LastLoginDate, 0, @RoleId, @IsConfirmed);
	SET @UserId = SCOPE_IDENTITY();
	
	INSERT INTO dbo.UserDivisions (UserId, DivisionId)
	VALUES (@UserId, @DivisionId)

		MERGE dbo.Users_firebaseUids AS target
        USING (SELECT @UserId AS UserId, @FirebaseUid AS FirebaseUid) AS source
                ON target.UserId = source.UserId
        WHEN MATCHED THEN
                UPDATE SET FirebaseUid = source.Firebaseuid
        WHEN NOT MATCHED THEN
                INSERT (UserId, FirebaseUid)
                VALUES (source.UserId, source.FirebaseUid);
END