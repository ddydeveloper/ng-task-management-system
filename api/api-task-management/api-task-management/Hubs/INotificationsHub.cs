using System.Threading.Tasks;
using api_task_management.Dtos;

namespace api_task_management.Hubs
{
    public interface INotificationsHub
    {
        Task TaskCreated(TaskDto dto);

        Task TaskUpdated(TaskDto dto);
    }
}
