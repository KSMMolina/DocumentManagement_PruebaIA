using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class DocumentDeletedEvent : IDomainEvent
{
    public Guid DocumentId { get; }
    public Guid FolderId { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public DocumentDeletedEvent(Guid documentId, Guid folderId)
    {
        DocumentId = documentId;
        FolderId = folderId;
    }
}