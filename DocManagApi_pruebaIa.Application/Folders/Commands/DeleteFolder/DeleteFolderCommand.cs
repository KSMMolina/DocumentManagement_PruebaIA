using MediatR;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.DeleteFolder;

public sealed record DeleteFolderCommand(Guid FolderId) : IRequest<Unit>;