using System;

namespace TasksApi.CQRS_Queries.Results
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
