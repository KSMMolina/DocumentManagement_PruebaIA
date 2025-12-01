using MediatR;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UpdateDocument;

public sealed record UpdateDocumentCommand(Guid DocumentId, Guid FolderId, string Name, string? Description) : IRequest<Unit>;