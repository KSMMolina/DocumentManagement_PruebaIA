namespace DocManagApi_pruebaIa.Domain.Common.Abstractions;

public interface IAggregateRoot : IEntity
{
    IReadOnlyCollection<IDomainEvent> DomainEvents { get; }
    void ClearDomainEvents();
}