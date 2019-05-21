using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Options;
using TasksApi.CQRS_Commands.Commands;
using TasksApi.Models;

namespace TasksApi.CQRS_Commands.Handlers
{
    internal class UpdateTaskCommandHandler : ICommandHandler<UpdateTaskCommand>
    {
        private const string Sql = @"
UPDATE [dbo].[Tasks] SET 
    [Name]        = @Name,
    [Description] = @Description, 
    [Completed]   = @Completed, 
    [Status]      = @Status, 
    [Priority]    = @Priority
WHERE [Id] = @Id";

        private readonly string _connectionString;

        public UpdateTaskCommandHandler(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionString = connectionStrings.Value.TasksDb;
        }

        public void Handle(UpdateTaskCommand command)
        {
            using (var conn = new SqlConnection(this._connectionString))
            {
                conn.Execute(Sql, GetParam(command));
            }

            //todo: put updated id to queue
        }

        public async Task HandleAsync(UpdateTaskCommand command)
        {
            using (var conn = new SqlConnection(this._connectionString))
            {
                await conn.ExecuteAsync(Sql, GetParam(command));
            }

            //todo: put updated id to queue
        }

        private static DynamicParameters GetParam(UpdateTaskCommand command)
        {
            var param = new DynamicParameters();
            param.Add("@Id", command.Id, DbType.Int32, ParameterDirection.Input);
            param.Add("@Name", command.Name, DbType.String, ParameterDirection.Input);
            param.Add("@Description", command.Description, DbType.String, ParameterDirection.Input);
            param.Add("@Priority", command.Priority, DbType.Byte, ParameterDirection.Input);
            param.Add("@Status", command.Status, DbType.Byte, ParameterDirection.Input);
            param.Add("@Completed", command.Completed, DbType.DateTime, ParameterDirection.Input);

            return param;
        }
    }
}
