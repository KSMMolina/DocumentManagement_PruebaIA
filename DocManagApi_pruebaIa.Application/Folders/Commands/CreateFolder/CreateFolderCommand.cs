using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateFolder;

public sealed record CreateFolderCommand(
    Guid PropertyId,
    string Name,
    string? Description) : IRequest<Result<Guid>>;