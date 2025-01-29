ALTER PROC dbo.Reports_UpdateReportById
    @ReportId INT,
    @UserId INT,
    @MainAgency NVARCHAR(100),
    @SecondAgency NVARCHAR(100) = NULL,
    @OtherAgency NVARCHAR(100) = NULL,
    @TypeOfService NVARCHAR(100),
    @BeginDispatchDate DATE = NULL,
	@EndDispatchDate DATE = NULL,
	@BeginDispatchTime TIME(0) = NULL,
    @EndDispatchTime TIME(0) = NULL,
    @ContactName NVARCHAR(100),
    @ContactPhone NVARCHAR(20) = NULL,
    @DispatchAddress NVARCHAR(255),
    @DispatchAddressLine2 NVARCHAR(255) = NULL,
    @City NVARCHAR(100),
    @State NVARCHAR(50),
    @PostalCode NVARCHAR(20),
    @Narrative NVARCHAR(MAX) = NULL,
    @HoursOfService DECIMAL(5, 2),
    @MilesDriven DECIMAL(5, 2),
	@ReportDate datetime,
    @DivisionId INT
AS
/*
	DECLARE @ReportId INT = 5;

	EXEC dbo.Reports_UpdateReportById
		@ReportId,
		@UserId = 2,
		@MainAgency = 'Coastal Valley',
		@SecondAgency = NULL,
        @OtherAgency = NULL,
        @TypeOfService = 'Incident Response',
        @BeginDispatchDate = '2024-11-10',
        @EndDispatchDate = '2024-11-10',
		@BeginDispatchTime = '08:00',
		@EndDispatchTime = '12:00',
        @ContactName = 'Jesus',
        @ContactPhone = '777-777-7777',
        @DispatchAddress = '316 John St',
        @DispatchAddressLine2 = 'Suite 777',
        @City = 'Not Las Vegas',
        @State = 'OR',
        @PostalCode = '97439',
        @Narrative = 'For god so loved the world, that he gave his only begotten Son...',
        @HoursOfService = NULL,
        @MilesDriven = 15.5,
		@ReportDate = '2024-09-25 10:45: 00',
		@DivisionId = 3

	SELECT *
	FROM dbo.Reports
	WHERE ReportId = @ReportId;
*/
BEGIN
	DECLARE @CurrentHours DECIMAL(10, 2) = 0;
	SELECT @CurrentHours = @HoursOfService
	FROM dbo.Reports
	WHERE ReportId = @ReportId;

	UPDATE dbo.Users
	SET HoursServed = HoursServed - @CurrentHours
	WHERE UserId = @UserId;

	DECLARE @DateDiffHours DECIMAL(5, 2) = DATEDIFF(DAY, @BeginDispatchDate, @EndDispatchDate)*24;
	DECLARE @TimeDiffHours DECIMAL(5, 2) =
		DATEDIFF(MINUTE, @BeginDispatchTime, @EndDispatchTime) / 60.0;
	SET @HoursOfService = @DateDiffHours + @TimeDiffHours;

	UPDATE dbo.Reports
	SET 
		UserId = @UserId,
		MainAgency = @MainAgency,
		SecondAgency = @SecondAgency,
		OtherAgency = @OtherAgency,
		TypeOfService = @TypeOfService,
		BeginDispatchDate = @BeginDispatchDate,
		EndDispatchDate = @EndDispatchDate,
		BeginDispatchTime = @BeginDispatchTime,
		EndDispatchTime = @EndDispatchTime,
		ContactName = @ContactName,
		ContactPhone = @ContactPhone,
		DispatchAddress = @DispatchAddress,
		DispatchAddressLine2 = @DispatchAddressLine2,
		City = @City,
		State = @State,
		PostalCode = @PostalCode,
		Narrative = @Narrative,
		HoursOfService = @HoursOfService,
		MilesDriven = @MilesDriven,
		ReportDate = @ReportDate,
		DivisionId = @DivisionId,
		DateModified = SYSDATETIME()
	WHERE ReportId = @ReportId;
END;
