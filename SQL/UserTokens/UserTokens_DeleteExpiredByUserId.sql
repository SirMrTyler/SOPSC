ALTER PROCEDURE [dbo].[UserTokens_DeleteExpiredByUserId]
    @UserId INT,
    @CurrentDate DATETIME2(7)
AS
BEGIN
    DELETE FROM UserTokens
    WHERE UserId = @UserId
    AND ExpiryDate < @CurrentDate
    AND IsNonExpiring = 0;
END
