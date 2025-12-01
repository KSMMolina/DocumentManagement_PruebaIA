using MediatR;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UploadDocument;

public sealed record UploadDocumentCommand(Guid FolderId, string Name, long SizeBytes, string? Description) : IRequest<Guid>;