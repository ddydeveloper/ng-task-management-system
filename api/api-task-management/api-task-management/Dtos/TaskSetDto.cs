using System.Collections.Generic;

namespace api_task_management.Dtos
{
    public class TaskSetDto
    {
        public IEnumerable<TaskDto> Tasks { get; set; }

        public int TotalCount { get; set; }
    }
}
