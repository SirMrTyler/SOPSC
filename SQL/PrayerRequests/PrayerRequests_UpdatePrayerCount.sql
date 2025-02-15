ALTER PROC dbo.PrayerRequests_UpdatePrayerCount
    @PrayerId INT,
    @UserId INT
AS
/* -- TESTING EXECUTION BLOCK
    DECLARE @PrayerId INT = 1;
    DECLARE @UserId INT = 3;

    EXEC dbo.PrayerRequests_UpdatePrayerCount
        @PrayerId,
        @UserId;
*/
BEGIN
    DECLARE 
        @OriginalPosterId INT,
        @PrayerCount INT,
        @NotificationContent NVARCHAR(255),
        @UserSpecificNotification NVARCHAR(255),
        @AlreadyPrayed BIT,
        @OriginalPosterName NVARCHAR(100);

    -- Get OP's UserId, Name, and current PrayerCount
    SELECT
        @OriginalPosterId = u.UserId,
        @OriginalPosterName = u.FirstName + ' ' + u.LastName,
        @PrayerCount = PrayerCount
    FROM dbo.PrayerRequests pr
    JOIN dbo.Users u ON pr.UserId = u.UserId
    WHERE PrayerId = @PrayerId;

    -- Check if the user has already prayed for this request
    SELECT @AlreadyPrayed = COUNT(*)
    FROM dbo.Notifications
    WHERE NotificationTypeId = 7
      AND UserId = @UserId
      AND NotificationContent = 'You joined ' + @OriginalPosterName + ' in prayer';

    -- If the user has already prayed, decrement the count and remove their "+1"
    IF @AlreadyPrayed = 1
    BEGIN
        -- Decrement PrayerCount
        UPDATE dbo.PrayerRequests
        SET PrayerCount = PrayerCount - 1
        WHERE PrayerId = @PrayerId;

        -- Remove the "+1" notification
        DELETE FROM dbo.Notifications
        WHERE NotificationTypeId = 7
          AND UserId = @UserId
          AND NotificationContent = 'You joined ' + @OriginalPosterName + ' in prayer';
    END
    ELSE
    BEGIN
        -- Increment PrayerCount
        UPDATE dbo.PrayerRequests
        SET PrayerCount = PrayerCount + 1
        WHERE PrayerId = @PrayerId;

        -- Get updated PrayerCount
        SELECT @PrayerCount = PrayerCount
        FROM dbo.PrayerRequests
        WHERE PrayerId = @PrayerId;

        -- Generate notification content for the original poster
        IF @PrayerCount = 1
            SET @NotificationContent = (
                SELECT u.FirstName + ' ' + u.LastName + ' has joined you in prayer'
                FROM dbo.Users u
                WHERE u.UserId = @UserId);
        ELSE
            SET @NotificationContent = (
                SELECT u.FirstName + ' ' + u.LastName + ' and ' + CAST(@PrayerCount - 1 AS NVARCHAR(10)) + ' other(s) have joined you in prayer'
                FROM dbo.Users u
                WHERE u.UserId = @UserId);

        -- Generate user-specific notification
        SET @UserSpecificNotification = 'You joined ' + @OriginalPosterName + ' in prayer';

        -- Insert Notification for the Original Poster
        INSERT INTO dbo.Notifications (
            NotificationTypeId,
            UserId,
            NotificationContent,
            CreatedTimestamp,
            IsRead
        )
        VALUES (
            7,
            @OriginalPosterId,
            @NotificationContent,
            SYSDATETIME(),
            0 -- Mark as unread
        );

        -- Insert User-Specific Notification for Tracking "+1"
        INSERT INTO dbo.Notifications (
            NotificationTypeId,
            UserId,
            NotificationContent,
            CreatedTimestamp,
            IsRead
        )
        VALUES (
            7,
            @UserId,
            @UserSpecificNotification,
            SYSDATETIME(),
            1 -- Mark as read
        );
    END;

    -- Select updated Prayer Request for confirmation
    SELECT
        pr.PrayerId,
        pr.Subject,
        pr.Body,
        pr.PrayerCount
    FROM dbo.PrayerRequests pr
    WHERE PrayerId = @PrayerId;
END;
