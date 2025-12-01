using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class FolderRenamedEvent : IDomainEvent
{
    public Guid FolderId { get; }
    public string OldName { get; }
    public string NewName { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public FolderRenamedEvent(Guid folderId, string oldName, string newName)
    {
        FolderId = folderId;
        OldName = oldName;
        NewName = newName;
    }
}