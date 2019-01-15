using System;

namespace api_task_management.Dtos
{
    public class TaskDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public byte Priority { get; set; }

        public byte Status { get; set; }

        public DateTime Added { get; set; }

        public DateTime Completed { get; set; }
    }
}
