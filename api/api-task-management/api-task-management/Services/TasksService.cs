using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using api_task_management.Dtos;
using Dapper;
using Microsoft.Extensions.Options;

namespace api_task_management.Services
{
    public class TasksService : ITasksService
    {
        private readonly ConnectionStrings _connectionStrings;

        public TasksService(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;
        }

        public async Task<TaskSetDto> GetTasks(int? status, int skip, int take, string orderBy, bool isDesc)
        {
            IEnumerable<TaskDto> tasks;
            int totalCount;

            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                var tasksSql = NativeSql.GetAllTasks;
                var countSql = NativeSql.GetAllTasksCount;

                var tasksParam = new DynamicParameters();
                tasksParam.Add("@Skip", skip, DbType.Int32, ParameterDirection.Input);
                tasksParam.Add("@Take", take, DbType.Int32, ParameterDirection.Input);
                tasksParam.Add("@IsDesc", isDesc, DbType.Boolean, ParameterDirection.Input);

                if (!string.IsNullOrWhiteSpace(orderBy))
                {
                    tasksParam.Add("@OrderBy", orderBy, DbType.String, ParameterDirection.Input);
                }

                DynamicParameters countParam = null;

                if (status.HasValue)
                {
                    tasksSql = NativeSql.GetTasksByStatus;
                    tasksParam.Add("@Status", status.Value, DbType.Int32, ParameterDirection.Input);

                    countSql = NativeSql.GetTasksByStatusCount;
                    countParam = new DynamicParameters();
                    countParam.Add("@Status", status.Value, DbType.Int32, ParameterDirection.Input);
                }

                tasks = await conn.QueryAsync<TaskDto>(tasksSql, tasksParam, commandType: CommandType.StoredProcedure);
                totalCount = await conn.ExecuteScalarAsync<int>(countSql, countParam);
            }

            return new TaskSetDto {Tasks = tasks, TotalCount = totalCount};
        }

        public async Task<int?> GetTaskRowNumber(int taskId, int? status)
        {
            int? result;
            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                var sql = NativeSql.GetTaskRowNumber;
                var param = new DynamicParameters();
                param.Add("@Id", taskId, DbType.Int32, ParameterDirection.Input);

                if (status.HasValue)
                {
                    sql = NativeSql.GetTaskRowNumberByStatus;
                    param.Add("@Status", status.Value, DbType.Int32, ParameterDirection.Input);
                }

                result = (await conn.QueryAsync<int?>(sql, param)).SingleOrDefault();
            }

            return result;
        }

        public async Task<int> GetTasksCountAsync(int? status)
        {
            int result;
            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                if (status.HasValue)
                {
                    var param = new DynamicParameters();
                    param.Add("@Status", status.Value, DbType.Int32, ParameterDirection.Input);
                    result = await conn.ExecuteScalarAsync<int>(NativeSql.GetTasksByStatusCount, param);
                }
                else
                {
                    result = await conn.ExecuteScalarAsync<int>(NativeSql.GetAllTasksCount);
                }
            }

            return result;
        }

        public async Task<TaskDto> CreateTask(TaskDto dto)
        {
            int createdId;
            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                var param = new DynamicParameters();
                param.Add("@Name", dto.Name, DbType.String, ParameterDirection.Input);
                param.Add("@Description", dto.Description, DbType.String, ParameterDirection.Input);
                param.Add("@Priority", dto.Priority, DbType.Byte, ParameterDirection.Input);
                param.Add("@Completed", dto.Completed, DbType.DateTime, ParameterDirection.Input);

                createdId = (await conn.QueryAsync<int>(NativeSql.CreateTask, param)).Single();
            }

            dto.Id = createdId;
            return dto;
        }

        public async Task<TaskDto> UpdateTask(TaskDto dto)
        {
            using (var conn = new SqlConnection(_connectionStrings.TasksDb))
            {
                var param = new DynamicParameters();
                param.Add("@Id", dto.Id, DbType.Int32, ParameterDirection.Input);
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
