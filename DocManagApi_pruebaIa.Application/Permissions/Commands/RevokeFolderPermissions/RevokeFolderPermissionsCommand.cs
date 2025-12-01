using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;

namespace DocManagApi_pruebaIa.Application.Permissions.Commands.RevokeFolderPermissions;

public sealed record RevokeFolderPermissionsCommand(
    Guid FolderId,
    Guid RoleId,
    IReadOnlyCollection<Guid> PermissionTypeIds
) : IRequest<Result<Unit>>;