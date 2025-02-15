USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[dbo.Notifications_SelectAllByUserId]    Script Date: 11/11/2024 7:05:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[dbo.Notifications_SelectAllByUserId]
	@UserId INT

AS
/*
-- Testing Execution Block
    DECLARE @UserId INT = 2; -- Example UserId for testing

    EXEC dbo.Notifications_SelectAllById
        @UserId;
*/
BEGIN
	SELECT
		n.NotificationId
		,n.NotificationTypeId
		,n.UserId AS ToUserId
		,u.FirstName + ' ' + u.LastName AS ToUserName
		,n.NotificationContent
		,n.CreatedTimestamp
		,n.ReadTimestamp
		,n.IsRead
		,n.MessageId
		-- Retrieve sender information from Messages table
		,s.UserId AS FromUserId
		,s.FirstName + ' ' + s.LastName AS FromUserName
	FROM dbo.Notifications AS n
	JOIN dbo.Users u ON n.UserId = u.UserId
	LEFT JOIN dbo.Messages m ON n.MessageId = m.MessageId
	LEFT JOIN dbo.Users s ON m.SenderId = s.UserId
	ORDER BY n.CreatedTimestamp DESC;
END;