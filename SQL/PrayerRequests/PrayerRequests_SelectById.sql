ALTER PROC dbo.PrayerRequests_SelectById
	@PrayerId INT
AS
/* -- TESTING EXECUTION BLOCK
	DECLARE @PrayerId INT = 1;

	EXEC dbo.PrayerRequests_SelectById
		@PrayerId;
*/
BEGIN
	SELECT
		pr.PrayerId,
		u.FirstName + ' ' + u.LastName AS UserName,
		pr.Subject,
		pr.Body,
		pr.PrayerCount,
		pr.DateCreated
	FROM dbo.PrayerRequests AS pr
	JOIN dbo.Users u ON pr.UserId = u.UserId
	WHERE pr.PrayerId = @PrayerId;
end;