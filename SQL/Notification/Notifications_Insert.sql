USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[dbo.Notifications_Insert]    Script Date: 11/11/2024 6:51:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[dbo.Notifications_Insert]
	(@NotificationId INT OUTPUT
	,@NotificationTypeId INT
	,@UserId INT
	,@NotificationContent NVARCHAR(50) = NULL
	,@MessageId INT = NULL)
AS
/*
-- Testing Execution Block
	DECLARE 
        @NotificationId INT,  -- Corrected typo here
        @NotificationTypeId INT = 1,
        @UserId INT = 2,
        @NotificationContent NVARCHAR(50) = NULL,
        @MessageId INT = 1;

    EXEC dbo.Notifications_Insert
        @NotificationId OUTPUT,
        @NotificationTypeId, -- Replace with actual NotificationTypeId for testing
        @UserId, -- Replace with actual UserId for testing
        @NotificationContent, -- Example content
        @MessageId = 1; -- Example MessageId, replace with actual if needed

    SELECT * 
    FROM dbo.Notifications
    WHERE NotificationId = @NotificationId;
*/
BEGIN
	IF @MessageId IS NOT NULL
	BEGIN
		SELECT @NotificationContent = LEFT(MessageContent, 30) + '...'
		FROM dbo.Messages
		WHERE MessageId = @MessageId;
	END

	INSERT INTO dbo.Notifications
		(NotificationTypeId
		,UserId
		,NotificationContent
		,MessageId)
	VALUES
		(@NotificationTypeId
		,@UserId
		,@NotificationContent
		,@MessageId)

	SET @NotificationId = SCOPE_IDENTITY();

	-- Return inserted notification for confirmation
	SELECT *
	FROM dbo.Notifications
	WHERE NotificationId = @NotificationId
END;