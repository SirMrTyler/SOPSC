ALTER PROCEDURE [dbo].[UserTokens_SelectByDeviceId]
    @DeviceId NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        TokenId,
        UserId,
        Token,
        DeviceId,
        DateCreated,
        ExpiryDate,
        IsNonExpiring
    FROM 
        UserTokens
    WHERE 
        DeviceId = @DeviceId;
END;
