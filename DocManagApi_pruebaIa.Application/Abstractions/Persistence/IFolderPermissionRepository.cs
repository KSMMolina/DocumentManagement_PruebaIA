namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IFolderPermissionRepository
{
    Task<bool> HasPermissionAsync(Guid folderId, Guid roleId, Guid permissionTypeId, CancellationToken ct);
}