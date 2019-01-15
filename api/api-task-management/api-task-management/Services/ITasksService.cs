using System.Collections.Generic;
using System.Threading.Tasks;
using api_task_management.Dtos;

namespace api_task_management.Services
{
    public interface ITasksService
    {
        Task<IEnumerable<TaskDto>> GetTasksAsync(int? status, int skip, int take);

        Task<TaskDto> CreateTaskAsync(TaskDto dto);

        Task<TaskDto> UpdateTaskAsync(TaskDto dto);
    }
}
