USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[Reports_Insert]    Script Date: 9/29/2024 1:08:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Reports_Insert]
    @ReportId INT OUTPUT,
	@UserId INT,
    @MainAgency NVARCHAR(100),
    @SecondAgency NVARCHAR(100) = NULL, -- Optional
    @OtherAgency NVARCHAR(100) = NULL,  -- Optional
    @TypeOfService NVARCHAR(100),
	@BeginDispatchDate DATE,
	@EndDispatchDate DATE,
    @BeginDispatchTime TIME(0),
    @EndDispatchTime TIME(0),
    @ContactName NVARCHAR(100),
    @ContactPhone NVARCHAR(20) = NULL,
    @DispatchAddress NVARCHAR(255),
    @DispatchAddressLine2 NVARCHAR(255) = NULL, -- Optional
    @City NVARCHAR(100),
    @State NVARCHAR(50),
    @PostalCode NVARCHAR(20),
    @Narrative NVARCHAR(MAX) = NULL,
    @HoursOfService DECIMAL(5, 2) = NULL,
    @MilesDriven DECIMAL(5, 2),
    @ReportDate DATETIME,
	@DivisionId INT
AS
/*
	DECLARE @ReportId INT;

	EXEC dbo.Reports_Insert
		@ReportId = @ReportId OUTPUT,
		@UserId = 2,
		@MainAgency = 'Coastal Valley',
		@SecondAgency = NULL,
        @OtherAgency = NULL,
        @TypeOfService = 'Incident Response',
        @BeginDispatchDate = '2024-11-10',
        @EndDispatchDate = '2024-11-10',
		@BeginDispatchTime = '08:00',
		@EndDispatchTime = '16:00',
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
		WHERE ReportId = @ReportId
*/
BEGIN
	DECLARE @DateDiffHours DECIMAL(5, 2) = DATEDIFF(DAY, @BeginDispatchDate, @EndDispatchDate)*24;
	DECLARE @TimeDiffHours DECIMAL(5, 2) =
		DATEDIFF(MINUTE, @BeginDispatchTime, @EndDispatchTime) / 60.0;
	SET @HoursOfService = @DateDiffHours + @TimeDiffHours;
	SELECT @HoursOfService AS CalculatedHours;

	INSERT INTO dbo.Reports (
		UserId,
		MainAgency,
        SecondAgency,
        OtherAgency,
        TypeOfService,
		BeginDispatchDate,
		EndDispatchDate,
        BeginDispatchTime,
        EndDispatchTime,
        ContactName,
        ContactPhone,
        DispatchAddress,
        DispatchAddressLine2,
        City,
        State,
        PostalCode,
        Narrative,
        HoursOfService,
        MilesDriven,
		ReportDate,
		DivisionId
	) VALUES (
		@UserId,
        @MainAgency,
        @SecondAgency,
        @OtherAgency,
        @TypeOfService,
        @BeginDispatchDate,
        @EndDispatchDate,
		@BeginDispatchTime,
		@EndDispatchTime,
        @ContactName,
        @ContactPhone,
        @DispatchAddress,
        @DispatchAddressLine2,
        @City,
        @State,
        @PostalCode,
        @Narrative,
        @HoursOfService,
        @MilesDriven,
		@ReportDate,
		@DivisionId
    );

	SET @ReportId = SCOPE_IDENTITY();

	UPDATE dbo.Users
	SET HoursServed = HoursServed + @HoursOfService
	WHERE UserId = @UserId;
END;