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

BULK INSERT [dbo].[Tasks]
    FROM '\opt\mssql-scripts\data.csv'
    WITH
    (
        FIRSTROW = 1,
        FIELDTERMINATOR = ';', 
        ROWTERMINATOR = '\n'
    )

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