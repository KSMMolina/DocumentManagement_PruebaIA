using DocManagApi_pruebaIa.Application.Permissions.Dtos;
using MediatR;

namespace DocManagApi_pruebaIa.Application.Permissions.Queries.GetFolderPermissions;

public sealed record GetFolderPermissionsQuery(Guid FolderId) : IRequest<IReadOnlyCollection<FolderPermissionResultDto>>;