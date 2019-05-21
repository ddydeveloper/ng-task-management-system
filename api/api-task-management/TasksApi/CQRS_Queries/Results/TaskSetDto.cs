using System.Collections.Generic;

namespace TasksApi.CQRS_Queries.Results
{
    public class TaskSetDto
    {
        public IEnumerable<TaskDto> Tasks { get; set; }

        public int TotalCount { get; set; }
    }
}
