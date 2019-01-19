USE [master]

CREATE DATABASE [Tasks]
GO

USE [Tasks]
GO

SET NOCOUNT ON;

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
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Name] NVARCHAR(100) NOT NULL, 
    [Description] NVARCHAR(500) NULL, 
    [Added] DATETIME NOT NULL DEFAULT (GETDATE()), 
    [Completed] DATETIME NOT NULL,
	[Priority] TINYINT NOT NULL,
    [Status] TINYINT NOT NULL,

    FOREIGN KEY (Priority) REFERENCES [dbo].[Priorities](Id),
    FOREIGN KEY (Status) REFERENCES [dbo].[Statuses](Id)
)

BULK INSERT [dbo].[Tasks]
    FROM '\opt\mssql-scripts\data.csv'
    WITH
    (
        FIRSTROW = 1,
        FIELDTERMINATOR = ';', 
        ROWTERMINATOR = '0x0a'
    )

PRINT N'BULK INSERT Completed'

GO
CREATE PROCEDURE [dbo].[GetAllTasks]
(
    @Skip	 INT,
    @Take	 INT,
	@OrderBy NVARCHAR(20) = N'Id',
	@IsDesc  BIT		  = 0
)
AS
BEGIN
    DECLARE @SQL		 NVARCHAR(MAX),
			@OrderClause NVARCHAR(20) = @OrderBy + ' ASC'
		
	IF (@IsDesc = 1) SET @OrderClause = @OrderBy + ' DESC'

    SET @SQL = 'SELECT *FROM [dbo].[Tasks] WHERE [Status] <> 2 ORDER BY ' + @OrderClause + ' OFFSET ' + CAST(@Skip AS VARCHAR(10)) + ' ROWS FETCH NEXT ' + CAST(@Take AS VARCHAR(10)) + ' ROWS ONLY'
    EXEC sp_ExecuteSQL @SQL
END
GO

CREATE PROCEDURE [dbo].[GetTasksByStatus]
(
    @Status  TINYINT,
    @Skip    INT,
    @Take	 INT,
	@OrderBy NVARCHAR(20) = N'Id',
	@IsDesc  BIT		  = 0
)
AS
BEGIN

    DECLARE @SQL         NVARCHAR(MAX),
			@OrderClause NVARCHAR(20) = @OrderBy + ' ASC'
    
    IF (@IsDesc = 1) SET @OrderClause = @OrderBy + ' DESC'

    SET @SQL = 'SELECT *FROM [dbo].[Tasks] WHERE [Status] = @Status ORDER BY ' + @OrderClause + ' OFFSET ' + CAST(@Skip AS VARCHAR(10)) + ' ROWS FETCH NEXT ' + CAST(@Take AS VARCHAR(10)) + ' ROWS ONLY'
    EXEC sp_ExecuteSQL @SQL, N'@Status TINYINT', @Status

END
GO

PRINT N'Tasks DB Prepared'

USE [master]