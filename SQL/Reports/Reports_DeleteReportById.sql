ALTER PROCEDURE [dbo].[Reports_DeleteReportById]
    @ReportId INT,
	@RequestingUserId INT -- ID of user attempting to delete the report.
AS
/*
    DECLARE @ReportId INT = 8; -- Example report ID for testing
	DECLARE @RequestingUserId INT = 5; -- Example user ID for testing

    EXEC dbo.Reports_DeleteReportById
        @ReportId,
		@RequestingUserId;

	SELECT *
	FROM dbo.Reports
*/
BEGIN
    DECLARE @CreatorUserId INT;
    DECLARE @HoursOfService DECIMAL(5, 2);
	DECLARE @UserRoleId INT;
	-- Retrieve the UserId of the report creator and HoursOfService for the report
	SELECT 
		@CreatorUserId = UserId, 
		@HoursOfService = HoursOfService
	FROM dbo.Reports
	WHERE ReportId = @ReportId;

	-- Check if requesting user has required role (Admin or Developer)
	SELECT @UserRoleId = RoleId
	FROM dbo.Users
	WHERE UserId = @RequestingUserId;

	IF @RequestingUserId = @CreatorUserId OR @UserRoleId IN (1, 4) -- RoleId 1=Admin, RoleId 4=Developer
	BEGIN
		UPDATE dbo.Users
		SET HoursServed = HoursServed - @HoursOfService
		WHERE UserId = @CreatorUserId;

		-- Delete Report
		DELETE FROM dbo.Reports
		WHERE ReportId = @ReportId;
		
		RETURN;
	END
	ELSE
		BEGIN
			RAISERROR('Permission Denied', 16, 1);
		END

	-- Deduct hours from user total
	
END;
