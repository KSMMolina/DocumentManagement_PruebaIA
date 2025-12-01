using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UploadDocument;

public sealed record UploadDocumentCommand(
    Guid FolderId,
    string Name,
    string? Description,
    long SizeBytes,
    string ContentSha256) : IRequest<Result<Guid>>;