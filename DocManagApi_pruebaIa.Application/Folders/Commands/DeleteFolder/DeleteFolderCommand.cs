using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.DeleteFolder;

public sealed record DeleteFolderCommand(Guid FolderId) : IRequest<Result<Unit>>;