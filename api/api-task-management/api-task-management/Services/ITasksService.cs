using System.Threading.Tasks;
using api_task_management.Dtos;

namespace api_task_management.Services
{
    public interface ITasksService
    {
        Task<TaskSetDto> GetTasks(int? status, int skip, int take, string orderBy, bool isDesc);

        Task<int?> GetTaskRowNumber(int taskId, int? status);

        Task<TaskDto> CreateTask(TaskDto dto);

        Task<TaskDto> UpdateTask(TaskDto dto);
    }
}
