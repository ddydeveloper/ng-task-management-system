using System.Threading.Tasks;
using api_task_management.Dtos;

namespace api_task_management.Services
{
    public interface ITasksService
    {
        Task<TaskSetDto> GetTasksAsync(int? status, int skip, int take, string orderBy, bool isDesc);

        Task<int?> GetTaskRowNumberAsync(int taskId, int? status);

        Task<TaskDto> CreateTaskAsync(TaskDto dto);

        Task<TaskDto> UpdateTaskAsync(TaskDto dto);
    }
}
