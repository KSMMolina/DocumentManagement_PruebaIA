using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class DocumentUploadedEvent : IDomainEvent
{
    public Guid DocumentId { get; }
    public Guid FolderId { get; }
    public string Name { get; }
    public long SizeBytes { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public DocumentUploadedEvent(Guid documentId, Guid folderId, string name, long sizeBytes)
    {
        DocumentId = documentId;
        FolderId = folderId;
        Name = name;
        SizeBytes = sizeBytes;
    }
}