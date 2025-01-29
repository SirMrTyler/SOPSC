ALTER PROC [dbo].[Users_SelectBySearch]
	@PageIndex int,
	@PageSize int,
	@Query nvarchar(100)

AS

/*
	DECLARE
		@PageIndex int = 1,
		@PageSize int = 3,
		@Query nvarchar(100) = 'Tyler'
	EXECUTE dbo.Users_SelectBySearch
		@PageIndex,
		@PageSize,
		@Query
*/

BEGIN
	DECLARE @StartingRow int = (@PageIndex-1) * @PageSize;
	SELECT 
		[UserId],
		[FirstName],
		[LastName],
		[Email],
		[DateCreated],
		[LastLoginDate],
		[IsActive],
		[RoleId],
		TotalCount = COUNT(1) OVER()		
	FROM [dbo].[Users]
	WHERE FirstName LIKE '%' + @Query + '%'
		OR LastName LIKE '%' + @Query + '%'
	ORDER BY UserId

	OFFSET @StartingRow ROWS
	FETCH NEXT @PageSize ROWS ONLY
END;