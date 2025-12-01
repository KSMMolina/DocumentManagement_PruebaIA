using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class FolderCreatedEvent : IDomainEvent
{
    public Guid FolderId { get; }
    public Guid PropertyId { get; }
    public Guid? ParentFolderId { get; }
    public int Depth { get; }
    public string Name { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public FolderCreatedEvent(Guid folderId, Guid propertyId, Guid? parentFolderId, int depth, string name)
    {
        FolderId = folderId;
        PropertyId = propertyId;
        ParentFolderId = parentFolderId;
        Depth = depth;
        Name = name;
    }
}