USE [master]

CREATE DATABASE [Tasks]
GO

USE [Tasks]
GO

SET NOCOUNT ON;

CREATE TABLE [dbo].[Statuses]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(0, 1), 
    [Name] NVARCHAR(100) NOT NULL, 
    [Description] NVARCHAR(500) NULL
)

INSERT INTO [dbo].[Statuses]([Name])
          SELECT (N'Active')
UNION ALL SELECT (N'Completed')
UNION ALL SELECT (N'Expired')

CREATE TABLE [dbo].[Priorities]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(0, 1), 
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
	[Priority] INT NOT NULL,
    [Status] INT NOT NULL,

    FOREIGN KEY (Priority) REFERENCES [dbo].[Priorities](Id),
    FOREIGN KEY (Status) REFERENCES [dbo].[Statuses](Id)
)

BULK INSERT [dbo].[Tasks]
    FROM '\opt\mssql-scripts\data.csv'
    WITH
    (
        FIRSTROW = 1,
        FIELDTERMINATOR = ';', 
        ROWTERMINATOR = '\n'
    )

/* Initial data

DECLARE @Idx            INT = 1,
        @Added          DATETIME = GETDATE(),
        @RandomDate     INT,
        @RandomStatus   INT,
        @RandomPriority INT

WHILE @Idx >=1 and @Idx <= 100000
BEGIN
    SELECT @RandomDate = ROUND(((11 - 1) * RAND()), 0),
           @RandomStatus = ROUND(((3 - 1) * RAND()), 0),
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
        N'The following task has ' + CAST(@Idx AS NVARCHAR(6)) + N' number
follow the complete date to define time to complete
added ' + CAST(@Added AS NVARCHAR(20)),
        @Added,
        CASE
            WHEN @Idx > 1    AND @Idx <= 200   THEN DATEADD(hour,   @RandomDate + @Idx, @Added)
            WHEN @Idx > 200  AND @Idx <= 1000  THEN DATEADD(minute, @RandomDate + @Idx, @Added)
            WHEN @Idx > 1000 AND @Idx <= 50000 THEN DATEADD(second, @RandomDate + @Idx, @Added)
            ELSE DATEADD(millisecond, @RandomDate + @Idx, @Added)
        END,
        @RandomPriority,
        @RandomStatus
    )

	SET @Idx = @Idx + 1
END

PRINT N'Tasks database is prepared'

*/