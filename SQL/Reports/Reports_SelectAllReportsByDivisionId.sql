USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[Reports_SelectAllReportsByDivisionId]    Script Date: 11/10/2024 3:20:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Reports_SelectAllReportsByDivisionId]
	@DivisionId INT
AS
/*
	DECLARE @DivisionId INT = 1;
	EXECUTE Reports_SelectAllReportsByDivisionId
		@DivisionId = @DivisionId;
*/
BEGIN
	SELECT 
        r.ReportId,
        r.DateCreated,
        u.UserId,
        u.FirstName,
        u.LastName,
        u.Email,
		d.DivisionId,
		d.DivisionName,
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
        r.DispatchAddressLine2,
        r.City,
        r.State,
        r.PostalCode,
        r.Narrative,
        r.HoursOfService,
        r.MilesDriven
    FROM dbo.Reports r
    JOIN dbo.Users u ON r.UserId = u.UserId
	JOIN dbo.Divisions d ON r.DivisionId = d.DivisionId
	WHERE r.DivisionId = @DivisionId
	ORDER BY r.DateCreated DESC;
END;