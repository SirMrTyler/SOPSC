ALTER PROC dbo.PrayerRequests_SelectAll
AS
/* -- TESTING EXECUTION BLOCK
	EXEC dbo.PrayerRequests_SelectAll;
*/
BEGIN
	SELECT
		pr.PrayerId,
		u.FirstName + ' ' + u.LastName AS UserName,
		pr.Subject,
		LEFT(pr.Body, 50) +
			CASE
				WHEN LEN(pr.body) > 50 THEN '...'
				ELSE ''
			END AS PrayerBody,
		pr.PrayerCount,
		pr.DateCreated
	FROM dbo.PrayerRequests AS pr
	JOIN dbo.Users u ON pr.UserId = u.UserId
	ORDER BY pr.DateCreated DESC;
END;