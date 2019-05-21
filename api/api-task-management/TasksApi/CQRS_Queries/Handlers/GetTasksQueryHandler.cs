using System.Threading.Tasks;
using TasksApi.CQRS_Queries.Queries;
using TasksApi.CQRS_Queries.Results;

namespace TasksApi.CQRS_Queries.Handlers
{
    public class GetTasksQueryHandler : IQueryHandler<GetTasksQuery, TaskSetDto>
    {
        public TaskSetDto Handle(GetTasksQuery query)
        {
            throw new System.NotImplementedException();
        }

        public Task<TaskSetDto> HandleAsync(GetTasksQuery query)
        {
            throw new System.NotImplementedException();
        }
    }
}
