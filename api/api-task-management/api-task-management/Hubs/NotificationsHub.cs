using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace api_task_management.Hubs
{
    public class NotificationsHub : Hub<INotificationsHub>
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
