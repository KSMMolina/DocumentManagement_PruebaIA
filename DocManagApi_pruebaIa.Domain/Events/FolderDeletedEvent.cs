using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class FolderDeletedEvent : IDomainEvent
{
    public Guid FolderId { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public FolderDeletedEvent(Guid folderId) => FolderId = folderId;
}