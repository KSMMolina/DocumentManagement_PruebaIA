using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateSubfolder;

public sealed record CreateSubfolderCommand(
    Guid ParentFolderId,
    string Name,
    string? Description) : IRequest<Result<Guid>>;