using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Events;

public sealed class FolderPermissionsRevokedEvent : IDomainEvent
{
    public Guid FolderId { get; }
    public Guid RoleId { get; }
    public IReadOnlyCollection<string> PermissionCodes { get; }
    public DateTime OccurredOn { get; } = DateTime.UtcNow;

    public FolderPermissionsRevokedEvent(Guid folderId, Guid roleId, IReadOnlyCollection<string> permissionCodes)
    {
        FolderId = folderId;
        RoleId = roleId;
        PermissionCodes = permissionCodes;
    }
}