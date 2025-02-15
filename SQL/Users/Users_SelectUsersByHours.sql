ALTER PROC [dbo].[Users_SelectUsersByHours]
AS
/*
	EXECUTE dbo.Users_SelectUsersByHours
*/
BEGIN
	SELECT
		u.UserId,
		u.FirstName,
		u.LastName,
		u.Email,
		SUM(r.HoursOfService) AS TotalHours
	FROM dbo.Users u
	LEFT JOIN dbo.Reports r ON u.UserId = r.UserId
	GROUP BY u.UserId, u.FirstName, u.LastName, u.Email
	ORDER BY TotalHours DESC;
END;