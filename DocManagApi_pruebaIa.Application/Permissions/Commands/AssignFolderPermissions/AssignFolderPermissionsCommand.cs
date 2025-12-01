using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;

namespace DocManagApi_pruebaIa.Application.Permissions.Commands.AssignFolderPermissions;

public sealed record AssignFolderPermissionsCommand(
    Guid FolderId,
    Guid RoleId,
    IReadOnlyCollection<Guid> PermissionTypeIds
) : IRequest<Result<Unit>>;