using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class FolderPermission : IEntity
{
    public Guid Id { get; private set; }
    public Guid FolderId { get; private set; }
    public Guid RoleId { get; private set; }
    public Guid PermissionTypeId { get; private set; }
    public DateTime GrantedAt { get; private set; }

    internal FolderPermission() { }

    public FolderPermission(Guid id, Guid folderId, Guid roleId, Guid permissionTypeId)
    {
        Id = id;
        FolderId = folderId;
        RoleId = roleId;
        PermissionTypeId = permissionTypeId;
        GrantedAt = DateTime.UtcNow;
    }

    internal static FolderPermission Rehydrate(Guid id, Guid folderId, Guid roleId, Guid permissionTypeId, DateTime grantedAt)
    {
        return new FolderPermission
        {
            Id = id,
            FolderId = folderId,
            RoleId = roleId,
            PermissionTypeId = permissionTypeId,
            GrantedAt = grantedAt
        };
    }
}