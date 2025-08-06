ALTER PROC dbo.CalendarEvents_InsertNoLink
        @EventId INT OUTPUT,
        @GoogleEventId NVARCHAR(255) = NULL,
        @StartDateTime DATETIME2(7),
        @EndDateTime DATETIME2(7),
        @Title NVARCHAR(255),
        @Description NVARCHAR(MAX) = NULL,
        @Category NVARCHAR(100) = NULL,
        @CreatedBy INT
AS
BEGIN
        INSERT INTO dbo.CalendarEvents (
                GoogleEventId,
                StartDateTime,
                EndDateTime,
                Title,
                Description,
                Category,
                CreatedBy,
                CreatedTimestamp)
        VALUES (
                @GoogleEventId,
                @StartDateTime,
                @EndDateTime,
                @Title,
                @Description,
                @Category,
                @CreatedBy,
                SYSDATETIME());
        SET @EventId = SCOPE_IDENTITY();
        SELECT *
        FROM dbo.CalendarEvents
        WHERE EventId = @EventId;
END
GO