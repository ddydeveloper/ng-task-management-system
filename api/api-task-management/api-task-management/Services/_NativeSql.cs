namespace api_task_management.Services
{
    public class NativeSql
    {
        public const string GetAllTasks = @"[dbo].[GetAllTasks]";

        public const string GetAllTasksCount = @"SELECT COUNT(1) FROM [dbo].[Tasks] WHERE [Status] <> 2";

        public const string GetTasksByStatus = @"[dbo].[GetTasksByStatus]";
        
        public const string GetTasksByStatusCount = @"SELECT COUNT(1) FROM [dbo].[Tasks] WHERE [Status] = @Status";

        public const string CreateTask = @"
INSERT INTO [dbo].[Tasks] ([Name], [Description], [Completed], [Status], [Priority])
VALUES (@Name, @Description, @Completed, 0, @Priority)
SELECT CAST(SCOPE_IDENTITY() as INT)";

        public const string UpdateTask = @"
UPDATE [dbo].[Tasks] SET 
    [Name]        = @Name,
    [Description] = @Description, 
    [Completed]   = @Completed, 
    [Status]      = @Status, 
    [Priority]    = @Priority
WHERE [Id] = @Id";

        public const string GetTaskRowNumber = @"
SELECT [Number]
FROM (
	SELECT 
		[Id],
		ROW_NUMBER() OVER(ORDER BY [Id] ASC) AS [Number]
	FROM Tasks
	WHERE [Status] <> 2
) AS RowNumbers
WHERE [Id] = @Id
";

        public const string GetTaskRowNumberByStatus = @"
SELECT [Number]
FROM (
	SELECT 
		[Id],
		ROW_NUMBER() OVER(ORDER BY [Id] ASC) AS [Number]
	FROM Tasks
	WHERE [Status] = @Status
) AS RowNumbers
WHERE [Id] = @Id
";
    }
}
