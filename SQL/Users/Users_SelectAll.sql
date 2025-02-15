USE [SOPSC]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectAll]    Script Date: 12/16/2024 12:25:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Users_SelectAll]
	@PageIndex INT,
	@PageSize INT
AS

/*
	DECLARE 
		@PageIndex INT = 0,
		@PageSize INT = 5

	EXECUTE dbo.Users_SelectAll
		@PageIndex,
		@PageSize
*/

BEGIN
	DECLARE @Offset INT = @PageIndex * @PageSize

	SELECT 
		[UserId],
		[FirstName],
		[LastName],
		[Email],
		[DateCreated],
		[LastLoginDate],
		[ProfilePicturePath],
		[IsActive],
		[HoursServed],
		[RoleId],
		COUNT(1) OVER() AS TotalCount
	FROM [dbo].[Users]
	ORDER BY UserId
	OFFSET @Offset Rows
	FETCH NEXT @PageSize Rows ONLY
END