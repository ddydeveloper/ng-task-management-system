namespace api_task_management.Services
{
    public class NativeSql
    {
        public const string GetAllTasks = @"[dbo].[GetAllTasks]";

        public const string GetTasksByStatus = @"[dbo].[GetTasksByStatus]";

        public const string CreateTask = @"
INSERT INTO [dbo].[Tasks] ([Name], [Description], [Completed], [Status], [Priority])
VALUES (@Name, @Description, @Completed, @Status, @Priority)
SELECT CAST(SCOPE_IDENTITY() as INT)";

        public const string UpdateTask = @"
UPDATE [dbo].[Tasks] SET 
    [Name]        = @Name,
    [Description] = @Description, 
    [Completed]   = @Completed, 
    [Status]      = @Status, 
    [Priority]    = @Priority
WHERE [Id] = @Id";
    }
}
