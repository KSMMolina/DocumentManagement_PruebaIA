using MediatR;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.DeleteDocument;

public sealed record DeleteDocumentCommand(Guid FolderId, Guid DocumentId) : IRequest<Unit>;