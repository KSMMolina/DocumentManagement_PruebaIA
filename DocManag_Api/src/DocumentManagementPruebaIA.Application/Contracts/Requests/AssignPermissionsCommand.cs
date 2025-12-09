using DocumentManagementPruebaIA.Application.Contracts.DTOs;

namespace DocumentManagementPruebaIA.Application.Contracts.Requests;

public sealed record AssignPermissionsCommand(Guid FolderId, IReadOnlyCollection<PermissionDto> Permissions);
