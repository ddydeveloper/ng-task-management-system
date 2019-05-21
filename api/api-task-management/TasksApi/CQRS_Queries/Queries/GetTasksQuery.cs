using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TasksApi.CQRS_Queries.Results;

namespace TasksApi.CQRS_Queries.Queries
{
    public class GetTasksQuery : IQuery<TaskSetDto>
    {
        public int? Status { get; set; }

        public int Skip { get; set; }

        public int Take { get; set; }

        public  string OrderBy { get; set; }

        public bool IsDesc { get; set; }
    }
}
