using System;

namespace TasksApi.CQRS_Commands.Commands
{
    internal class UpdateTaskCommand : ICommand
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public byte Priority { get; set; }

        public byte Status { get; set; }

        public DateTime Completed { get; set; }
    }
}
