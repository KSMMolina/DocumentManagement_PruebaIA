using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DocManagApi_pruebaIa.Infrastructure.Repositories;

public sealed class FolderPermissionRepository : IFolderPermissionRepository
{
    private readonly DocumentManagementDbContext _db;
    public FolderPermissionRepository(DocumentManagementDbContext db) => _db = db;

    public Task<bool> HasPermissionAsync(Guid folderId, Guid roleId, Guid permissionTypeId, CancellationToken ct)
        => _db.FolderPermissions.AnyAsync(x => x.FolderId == folderId && x.RoleId == roleId && x.PermissionTypeId == permissionTypeId, ct);
}