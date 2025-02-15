USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[Roles_UpdateRolesByUserId]    Script Date: 12/13/2024 7:45:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Roles_UpdateRolesByUserId]
	@UserId INT,
	@RoleId INT

AS

/*
	DECLARE @UserId INT = 2; -- Pick the user who's role will be updated
	DECLARE @RoleId INT = 3; -- 3 = Guest Role, 2 = Member Role, 1 = Admin Role
	EXECUTE dbo.Roles_Insert
		@RoleName = 'Admin', -- Change 'Admin' to the role name you'd like to assign.
		@RoleId = @RoleId OUTPUT;

	-- Check newly inserted RoleId
	SELECT @RoleId AS NewRoleId;
*/

BEGIN
	IF EXISTS (SELECT 1 FROM dbo.Users WHERE UserId = @UserId)
	BEGIN
		UPDATE dbo.Users
		SET 
			IsConfirmed = CASE
							WHEN @RoleId < 3 OR @RoleId = 4 THEN 1
							ELSE IsConfirmed
						  END,
			RoleId = @RoleId
		WHERE UserId = @UserId;

		PRINT 'Role updated successfully for UserId: ' + CAST(@UserId AS NVARCHAR);
	END
	ELSE
	BEGIN
		PRINT 'Error: UserId ' + CAST(@UserId AS NVARCHAR) + ' does not exist.';
	END
END;