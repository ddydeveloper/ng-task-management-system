using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Options;
using TasksApi.CQRS_Commands.Commands;
using TasksApi.Models;

namespace TasksApi.CQRS_Commands.Handlers
{
    internal class CreateTaskCommandHandler : ICommandHandler<CreateTaskCommand>
    {
        private const string Sql = @"
INSERT INTO [dbo].[Tasks] ([Name], [Description], [Completed], [Status], [Priority])
VALUES (@Name, @Description, @Completed, 0, @Priority)
SELECT CAST(SCOPE_IDENTITY() as INT)";

        private readonly string _connectionString;

        public CreateTaskCommandHandler(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionString = connectionStrings.Value.TasksDb;
        }

        public void Handle(CreateTaskCommand command)
        {
            int createdId;
            using (var conn = new SqlConnection(_connectionString))
            {
                createdId = (conn.Query<int>(Sql, GetParam(command))).Single();
            }

            // put new task to queue
        }

        public async Task HandleAsync(CreateTaskCommand command)
        {
            int createdId;
            using (var conn = new SqlConnection(_connectionString))
            {
                createdId = (await conn.QueryAsync<int>(Sql, GetParam(command))).Single();
            }

            // put new task to queue
        }

        private static DynamicParameters GetParam(CreateTaskCommand command)
        {
            var param = new DynamicParameters();
            param.Add("@Name", command.Name, DbType.String, ParameterDirection.Input);
            param.Add("@Description", command.Description, DbType.String, ParameterDirection.Input);
            param.Add("@Priority", command.Priority, DbType.Byte, ParameterDirection.Input);
            param.Add("@Completed", command.Completed, DbType.DateTime, ParameterDirection.Input);

            return param;
        }
    }
}
