USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[Reports_SelectAllReportsByUser]    Script Date: 9/29/2024 1:06:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Reports_SelectAllReportsByUser]
	@UserId INT -- Id of user (chaplain) whose reports you want to retrieve
AS
/*
	DECLARE @UserId INT = 2 -- Replace with UserId you want to query
	EXECUTE dbo.Reports_SelectAllReportsByUser
		@UserId = @UserId;
*/
BEGIN
	SELECT
        r.ReportId,
        r.ReportDate,
        r.MainAgency,
        r.SecondAgency,
        r.OtherAgency,
        r.TypeOfService,
		r.BeginDispatchDate,
		r.EndDispatchDate,
        r.BeginDispatchTime,
        r.EndDispatchTime,
        r.ContactName,
        r.ContactPhone,
        r.DispatchAddress,
        r.AddressLine2,
        r.City,
        r.State,
        r.PostalCode,
        r.Narrative,
        r.HoursOfService,
        r.MilesDriven,
        r.DateCreated
    FROM 
        dbo.Reports r
    WHERE 
        r.UserId = @UserId
    ORDER BY 
        r.ReportDate DESC;  -- Sorting by the most recent report first
END;