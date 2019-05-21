using System;

namespace TasksApi.CQRS_Commands.Commands
{
    internal class CreateTaskCommand : ICommand
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public byte Priority { get; set; }

        public DateTime Completed { get; set; }
    }
}
