using System.Collections.Generic;
using System.Threading.Tasks;
using api_task_management.Dtos;
using api_task_management.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_task_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITasksService _tasksService;

        public TasksController(ITasksService tasksService)
        {
            _tasksService = tasksService;
        }

        [HttpGet]
        public async Task<IEnumerable<TaskDto>> GetTasksAsync(int? status, int skip, int take)
        {
            return await _tasksService.GetTasksAsync(status, skip, take);
        }

        [HttpGet("count")]
        public async Task<int> GetTasksCountAsync(int? status)
        {
            return await _tasksService.GetTasksCountAsync(status);
        }

        [HttpPost]
        public async Task<TaskDto> CreateTaskAsync(TaskDto dto)
        {
            return await _tasksService.CreateTaskAsync(dto);
        }

        [HttpPut]
        public async Task<TaskDto> UpdateTaskAsync(TaskDto dto)
        {
            return await _tasksService.UpdateTaskAsync(dto);
        }
    }
}