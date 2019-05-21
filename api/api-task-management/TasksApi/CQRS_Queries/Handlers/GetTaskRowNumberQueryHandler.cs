using System.Threading.Tasks;
using TasksApi.CQRS_Queries.Queries;

namespace TasksApi.CQRS_Queries.Handlers
{
    public class GetTaskRowNumberQueryHandler : IQueryHandler<GetTaskRowNumberQuery, int?>
    {
        public int? Handle(GetTaskRowNumberQuery query)
        {
            throw new System.NotImplementedException();
        }

        public Task<int?> HandleAsync(GetTaskRowNumberQuery query)
        {
            throw new System.NotImplementedException();
        }
    }
}
