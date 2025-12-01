using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;

namespace DocManagApi_pruebaIa.Application.Permissions.Commands.AssignFolderPermissions;

public sealed class AssignFolderPermissionsCommandHandler : IRequestHandler<AssignFolderPermissionsCommand, Result<Unit>>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IRoleRepository _roleRepo;
    private readonly IPermissionTypeRepository _permRepo;
    private readonly IUnitOfWork _uow;

    public AssignFolderPermissionsCommandHandler(
        IFolderRepository folderRepo,
        IRoleRepository roleRepo,
        IPermissionTypeRepository permRepo,
        IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _roleRepo = roleRepo;
        _permRepo = permRepo;
        _uow = uow;
    }

    public async Task<Result<Unit>> Handle(AssignFolderPermissionsCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct);
        if (folder is null || folder.IsDeleted)
            return Result<Unit>.Failure(Error.From("Folder.NotFound", "No se encontró la carpeta."));

        var roleTuple = await _roleRepo.GetRoleCodeAsync(request.RoleId, ct);
        if (roleTuple is null)
            return Result<Unit>.Failure(Error.From("Role.NotFound", "No se encontró el rol."));

        var permCatalog = new List<(Guid permId, string permCode)>();
        foreach (var pid in request.PermissionTypeIds)
        {
            var permTuple = await _permRepo.GetPermissionCodeAsync(pid, ct);
            if (permTuple is null)
                return Result<Unit>.Failure(Error.From("PermissionType.NotFound", $"No se encontró el permiso '{pid}'."));
            permCatalog.Add(permTuple.Value);
        }

        try
        {
            folder.AssignPermissions(
                request.RoleId,
                request.PermissionTypeIds,
                new[] { roleTuple.Value },
                permCatalog);

            _folderRepo.Update(folder);
            await _uow.SaveChangesAsync(ct);

            return Result<Unit>.Success(Unit.Value);
        }
        catch (DomainException ex)
        {
            return Result<Unit>.Failure(DomainExceptionMapper.ToError(ex));
        }
    }
}