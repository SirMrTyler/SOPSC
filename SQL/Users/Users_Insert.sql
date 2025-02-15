USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[Users_Insert]    Script Date: 12/12/2024 5:18:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Users_Insert]
	(@UserId int OUTPUT
	,@FirstName nvarchar(50)
	,@LastName nvarchar(50)
	,@Email nvarchar(100)
	,@Password nvarchar(255)
	)
AS
/* 
-- SELECT Statement Example:
-- Uncomment and customize the following block to run a test insert and select inserted user

	DECLARE @UserId int = 1 --Change x to id you want to select

	DECLARE
		@FirstName nvarchar(50) = 'Tyler',
		@LastName nvarchar(50) = 'Klein',
		@Email nvarchar(100) = 'sirmrtyler.business@gmail.com',
		@Password nvarchar(255) = '!LonxPrince1!',
		@IsActive bit = 1,
		@RoleId int = 1; -- 1 represents admin role
	EXECUTE dbo.Users_Insert
		@UserId OUTPUT,
		@FirstName,
		@LastName,
		@Email,
		@Password,
		@IsActive,
		@RoleId

	SELECT *
	FROM dbo.Users
	WHERE UserId = @UserId;


*/
BEGIN
	DECLARE 
		@LastLoginDate DATETIME2(7) = GETDATE(),
		@IsActive bit = 1;
	INSERT INTO dbo.Users
		(FirstName,
		LastName,
		Email,
		Password,
		LastLoginDate,
		IsActive)
	VALUES
		(@FirstName,
		@LastName,
		@Email,
		@Password,
		@LastLoginDate,
		@IsActive)

	SET @UserId = SCOPE_IDENTITY();
END
