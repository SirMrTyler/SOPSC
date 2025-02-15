ALTER PROC [dbo].[Reports_SelectAll]

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