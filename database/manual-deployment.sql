USE [master]

CREATE DATABASE [Tasks]
GO

USE [Tasks]
GO

CREATE TABLE [dbo].[Statuses]
(
	[Id] TINYINT NOT NULL PRIMARY KEY IDENTITY(0, 1), 
    [Name] NVARCHAR(100) NOT NULL, 
    [Description] NVARCHAR(500) NULL
)

INSERT INTO [dbo].[Statuses]([Name])
          SELECT (N'Active')
UNION ALL SELECT (N'Completed')
UNION ALL SELECT (N'Archived')

CREATE TABLE [dbo].[Priorities]
(
	[Id] TINYINT NOT NULL PRIMARY KEY IDENTITY(0, 1), 
    [Name] NVARCHAR(100) NOT NULL, 
    [Description] NVARCHAR(500) NULL
)

INSERT INTO [dbo].[Priorities]([Name])
          SELECT (N'Minor')
UNION ALL SELECT (N'Low')
UNION ALL SELECT (N'Medium')
UNION ALL SELECT (N'High')
UNION ALL SELECT (N'Highest')
UNION ALL SELECT (N'Blocker')

CREATE TABLE [dbo].[Tasks]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(0,1), 
    [Name] NVARCHAR(100) NOT NULL, 
    [Description] NVARCHAR(500) NULL, 
    [Added] DATETIME NOT NULL DEFAULT (GETDATE()), 
    [Completed] DATETIME NOT NULL,
	[Priority] TINYINT NOT NULL,
    [Status] TINYINT NOT NULL,

    FOREIGN KEY (Priority) REFERENCES [dbo].[Priorities](Id),
    FOREIGN KEY (Status) REFERENCES [dbo].[Statuses](Id)
)

DECLARE @Idx            INT = 1,
        @Added          DATETIME = GETDATE(),
        @RandomDate     INT,
        @RandomStatus   INT,
        @RandomPriority INT

WHILE @Idx >=1 and @Idx <= 100000
BEGIN
    SELECT @RandomDate = ROUND(((21 - 1) * RAND()), 0),
           @RandomStatus = ROUND(((2 - 1) * RAND()), 0),
           @RandomPriority = ROUND(((6 - 1) * RAND()), 0)

    INSERT INTO [dbo].[Tasks] 
    (
        [Name], 
        [Description], 
        [Added], 
        [Completed], 
        [Priority], 
        [Status]
    )
    VALUES (
        N'Test task # ' + CAST(@Idx AS NVARCHAR(6)),
        N'The following task has ' + CAST(@Idx AS NVARCHAR(6)) + N' number follow the complete date to define time to complete added ' + CAST(@Added AS NVARCHAR(20)),
        @Added,
        CASE
            WHEN @Idx > 1    AND @Idx <= 200   THEN DATEADD(day,   @RandomDate, @Added)
            WHEN @Idx > 200  AND @Idx <= 1000  THEN DATEADD(hour, @RandomDate, @Added)
            WHEN @Idx > 1000 AND @Idx <= 50000 THEN DATEADD(minute, @RandomDate, @Added)
            ELSE DATEADD(second, @RandomDate, @Added)
        END,
        @RandomPriority,
        @RandomStatus
    )

	SET @Idx = @Idx + 1
END

GO
CREATE PROCEDURE [dbo].[GetAllTasks]
(
    @Skip   INT,
    @Take	INT
)
AS
BEGIN
    DECLARE @SQL NVARCHAR(MAX)

    SET @SQL = 'SELECT *FROM [dbo].[Tasks] WHERE [Status] <> 2 ORDER BY [Completed] DESC, [Name] ASC OFFSET ' + CAST(@Skip AS VARCHAR(10)) + ' ROWS FETCH NEXT ' + CAST(@Take AS VARCHAR(10)) + ' ROWS ONLY'
    EXEC sp_ExecuteSQL @SQL
END
GO

CREATE PROCEDURE [dbo].[GetTasksByStatus]
(
    @Status TINYINT,
    @Skip   INT,
    @Take	INT
)
AS
BEGIN

    DECLARE @SQL NVARCHAR(MAX)
    
    SET @SQL = 'SELECT *FROM [dbo].[Tasks] WHERE [Status] = @Status ORDER BY [Completed] DESC, [Name] ASC OFFSET ' + CAST(@Skip AS VARCHAR(10)) + ' ROWS FETCH NEXT ' + CAST(@Take AS VARCHAR(10)) + ' ROWS ONLY'
    EXEC sp_ExecuteSQL @SQL, N'@Status TINYINT', @Status

END
GO