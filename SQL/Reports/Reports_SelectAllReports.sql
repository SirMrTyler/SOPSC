USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[Reports_SelectAllReports]    Script Date: 9/29/2024 1:07:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Reports_SelectAllReports]

AS
/*
	EXECUTE dbo.Reports_SelectAllReports
*/
BEGIN
	SELECT
		r.ReportId,
        r.ReportDate,
        u.UserId,
        u.FirstName,
        u.LastName,
        u.Email,
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
	FROM dbo.Reports r
	JOIN dbo.Users u ON r.UserId = u.UserId
	ORDER BY r.ReportDate DESC;
END;