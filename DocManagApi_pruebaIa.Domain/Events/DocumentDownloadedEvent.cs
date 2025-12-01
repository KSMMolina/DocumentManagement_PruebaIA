using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class DocumentDownloadedEvent : IDomainEvent
{
    public Guid DocumentId { get; }
    public Guid FolderId { get; }
    public Guid UserId { get; }
    public Guid RoleId { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public DocumentDownloadedEvent(Guid documentId, Guid folderId, Guid userId, Guid roleId)
    {
        DocumentId = documentId;
        FolderId = folderId;
        UserId = userId;
        RoleId = roleId;
    }
}