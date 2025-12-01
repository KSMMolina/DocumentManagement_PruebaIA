using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class DocumentUpdatedEvent : IDomainEvent
{
    public Guid DocumentId { get; }
    public string OldName { get; }
    public string NewName { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public DocumentUpdatedEvent(Guid documentId, string oldName, string newName)
    {
        DocumentId = documentId;
        OldName = oldName;
        NewName = newName;
    }
}