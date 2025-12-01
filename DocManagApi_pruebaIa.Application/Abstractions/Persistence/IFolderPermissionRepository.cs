namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IFolderPermissionRepository
{
    Task<bool> HasPermissionAsync(Guid folderId, Guid roleId, Guid permissionTypeId, CancellationToken ct);
    //To do: cambiar a IReadOnlyCollection<(Guid RoleId, Guid PermissionTypeId)>
    Task<IReadOnlyCollection<(Guid RoleId, Guid PermissionTypeId)>> GetPermissionsAsync(Guid folderId, CancellationToken ct);
}