using System.Threading.Tasks;

namespace TasksApi.CQRS_Commands
{
    internal interface ICommandHandler<TCommand> where TCommand : ICommand
    {
        void Handle(TCommand command);

        Task HandleAsync(TCommand command);
    }
}
