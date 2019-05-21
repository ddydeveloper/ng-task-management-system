using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TasksApi.CQRS_Queries.Queries
{
    public class GetTaskRowNumberQuery : IQuery<int?>
    {
        public int TaskId { get; set; }

        public int? Status { get; set; }
    }
}
