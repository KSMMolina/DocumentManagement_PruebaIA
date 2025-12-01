using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.RenameFolder;

public sealed record RenameFolderCommand(Guid FolderId, string NewName) : IRequest<Result<Unit>>;