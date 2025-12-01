using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;

namespace DocManagApi_pruebaIa.Application.Permissions.Commands.RevokeFolderPermissions;

public sealed class RevokeFolderPermissionsCommandHandler : IRequestHandler<RevokeFolderPermissionsCommand, Unit>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IRoleRepository _roleRepo;
    private readonly IPermissionTypeRepository _permRepo;
    private readonly IUnitOfWork _uow;

    public RevokeFolderPermissionsCommandHandler(IFolderRepository folderRepo, IRoleRepository roleRepo, IPermissionTypeRepository permRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _roleRepo = roleRepo;
        _permRepo = permRepo;
        _uow = uow;
    }

    public async Task<Unit> Handle(RevokeFolderPermissionsCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        var roleCode = await _roleRepo.GetRoleCodeAsync(request.RoleId, ct)
            ?? throw new InvalidOperationException("Role.NotFound");

        var permCatalog = new List<(Guid permId, string permCode)>();
        foreach (var pid in request.PermissionTypeIds)
        {
            var pc = await _permRepo.GetPermissionCodeAsync(pid, ct)
                ?? throw new InvalidOperationException("PermissionType.NotFound");
            permCatalog.Add(pc);
        }

        folder.RevokePermissions(request.RoleId, request.PermissionTypeIds, new[] { roleCode }, permCatalog);
        _folderRepo.Update(folder);
        await _uow.SaveChangesAsync(ct);

        return Unit.Value;
    }
}