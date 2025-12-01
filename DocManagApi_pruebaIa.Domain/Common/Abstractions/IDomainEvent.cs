namespace DocManagApi_pruebaIa.Domain.Common.Abstractions;

public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}