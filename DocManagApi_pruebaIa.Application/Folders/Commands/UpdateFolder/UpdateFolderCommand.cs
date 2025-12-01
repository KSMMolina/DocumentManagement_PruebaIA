using MediatR;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.UpdateFolder;

public sealed record UpdateFolderCommand(Guid FolderId, string Name, string? Description) : IRequest<Unit>;