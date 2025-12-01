using MediatR;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateFolder;

public sealed record CreateFolderCommand(Guid PropertyId, string Name, string? Description) : IRequest<Guid>;