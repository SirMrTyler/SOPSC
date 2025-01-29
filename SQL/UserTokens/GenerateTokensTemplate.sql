-- Generate tokens for users 2, 3 (no expiry) and 5 (24-hour expiry)
DECLARE @UserId INT, @Token NVARCHAR(255), @ExpiryDate DATETIME2(7);

-- User 2 (No Expiry Date)
SET @UserId = 2;
SET @Token = NEWID(); -- Generates a unique GUID as the token
SET @ExpiryDate = NULL; -- No expiry date
INSERT INTO dbo.UserTokens (UserId, Token, ExpiryDate)
VALUES (@UserId, @Token, @ExpiryDate);

-- User 3 (No Expiry Date)
SET @UserId = 3;
SET @Token = NEWID();
SET @ExpiryDate = NULL; -- No expiry date
INSERT INTO dbo.UserTokens (UserId, Token, ExpiryDate)
VALUES (@UserId, @Token, @ExpiryDate);

-- User 5 (Expires in 24 hours)
SET @UserId = 5;
SET @Token = NEWID();
SET @ExpiryDate = DATEADD(HOUR, 24, GETUTCDATE()); -- Expires in 24 hours
INSERT INTO dbo.UserTokens (UserId, Token, ExpiryDate)
VALUES (@UserId, @Token, @ExpiryDate);

-- Verify the tokens
SELECT * FROM dbo.UserTokens;
