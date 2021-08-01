using System.Threading.Tasks;
using api_task_management.Dtos;
using api_task_management.Hubs;
using api_task_management.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace api_task_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITasksService _tasksService;

        private readonly IHubContext<NotificationsHub, INotificationsHub> _hubContext;

        public TasksController(ITasksService tasksService, IHubContext<NotificationsHub, INotificationsHub> hubContext)
        {
            _tasksService = tasksService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<TaskSetDto> GetTasksAsync(int? status, int skip, int take, string orderBy, bool isDesc)
        {
            return await _tasksService.GetTasks(status, skip, take, orderBy, isDesc);
        }

        [HttpGet("{id}/number")]
        public async Task<int?> GetTaskRowNumberAsync(int id, int? status)
        {
            return await _tasksService.GetTaskRowNumber(id, status);
        }

        [HttpPost]
        public async Task<TaskDto> CreateTaskAsync(TaskDto dto)
        {
            dto = await _tasksService.CreateTask(dto);
            await _hubContext.Clients.All.TaskCreated(dto);

            return dto;
        }

        [HttpPut("{id}")]
        public async Task<TaskDto> UpdateTaskAsync(int id, TaskDto dto)
        {
            dto = await _tasksService.UpdateTask(dto);
            await _hubContext.Clients.All.TaskUpdated(dto);

            return dto;
        }
    }
}