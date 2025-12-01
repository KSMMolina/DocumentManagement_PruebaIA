using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Permissions.Dtos;
using MediatR;

namespace DocManagApi_pruebaIa.Application.Permissions.Queries.GetFolderPermissions;

public sealed class GetFolderPermissionsQueryHandler : IRequestHandler<GetFolderPermissionsQuery, IReadOnlyCollection<FolderPermissionResultDto>>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IFolderPermissionRepository _permRepo;

    public GetFolderPermissionsQueryHandler(IFolderRepository folderRepo, IFolderPermissionRepository permRepo)
    {
        _folderRepo = folderRepo;
        _permRepo = permRepo;
    }

    public async Task<IReadOnlyCollection<FolderPermissionResultDto>> Handle(GetFolderPermissionsQuery request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        var perms = await _permRepo.GetPermissionsAsync(folder.Id, ct);

        return perms.Select(p => new FolderPermissionResultDto
        {
            RoleId = p.RoleId,
            PermissionTypeId = p.PermissionTypeId
        }).ToList();
    }
}