ALTER PROC [dbo].[Messages_UpdateReadStatus]
    @MessageId INT,
    @IsRead BIT
AS
BEGIN
    UPDATE dbo.Messages
    SET IsRead = @IsRead,
        ReadTimestamp = CASE WHEN @IsRead = 1 THEN SYSDATETIME() ELSE NULL END
    WHERE MessageId = @MessageId;

    SELECT *
    FROM dbo.Messages
    WHERE MessageId = @MessageId;
END;
GO