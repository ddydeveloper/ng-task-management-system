using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using api_task_management.Dtos;
using Dapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace api_task_management.Services
{
    public class TasksService : ITasksService
    {
        private readonly ConnectionStrings _connectionStrings;

        private readonly ILogger<ITasksService> _logger;

        public TasksService(IOptions<ConnectionStrings> connectionStrings, ILogger<ITasksService> logger)
        {
            _connectionStrings = connectionStrings.Value;
            _logger = logger;
        }

        public async Task<IEnumerable<TaskDto>> GetTasksAsync(int? status, int skip, int take)
        {
            IEnumerable<TaskDto> result;
            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                var sql = NativeSql.GetAllTasks;

                var param = new DynamicParameters();
                param.Add("@Skip", skip, DbType.Int32, ParameterDirection.Input);
                param.Add("@Take", take, DbType.Int32, ParameterDirection.Input);
                
                if (status.HasValue)
                {
                    sql = NativeSql.GetTasksByStatus;
                    param.Add("@Status", status.Value, DbType.Int32, ParameterDirection.Input);
                }
                
                result = await conn.QueryAsync<TaskDto>(sql, param, commandType: CommandType.StoredProcedure);
            }

            return result;
        }

        public async Task<TaskDto> CreateTaskAsync(TaskDto dto)
        {
            int createdId;
            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                var param = new DynamicParameters();
                param.Add("@Name", dto.Name, DbType.String, ParameterDirection.Input);
                param.Add("@Description", dto.Description, DbType.String, ParameterDirection.Input);
                param.Add("@Priority", dto.Priority, DbType.Byte, ParameterDirection.Input);
                param.Add("@Status", dto.Status, DbType.Byte, ParameterDirection.Input);
                param.Add("@Completed", dto.Completed, DbType.DateTime, ParameterDirection.Input);

                createdId = (await conn.QueryAsync<int>(NativeSql.CreateTask, param)).Single();
            }

            dto.Id = createdId;
            return dto;
        }

        public async Task<TaskDto> UpdateTaskAsync(TaskDto dto)
        {
            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                var param = new DynamicParameters();
                param.Add("@Name", dto.Name, DbType.String, ParameterDirection.Input);
                param.Add("@Description", dto.Description, DbType.String, ParameterDirection.Input);
                param.Add("@Priority", dto.Priority, DbType.Byte, ParameterDirection.Input);
                param.Add("@Status", dto.Status, DbType.Byte, ParameterDirection.Input);
                param.Add("@Completed", dto.Completed, DbType.DateTime, ParameterDirection.Input);

                await conn.ExecuteAsync(NativeSql.UpdateTask, param);
            }

            return dto;
        }
    }
}
