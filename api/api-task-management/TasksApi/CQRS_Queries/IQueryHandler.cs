using System.Threading.Tasks;

namespace TasksApi.CQRS_Queries
{
    internal interface IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        TResult Handle(TQuery query);

        Task<TResult> HandleAsync(TQuery query);
    }
}
