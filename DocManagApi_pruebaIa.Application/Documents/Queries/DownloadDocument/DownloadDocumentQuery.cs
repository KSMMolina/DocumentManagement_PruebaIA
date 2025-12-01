using MediatR;

namespace DocManagApi_pruebaIa.Application.Documents.Queries.DownloadDocument;

public sealed record DownloadDocumentQuery(Guid FolderId, Guid DocumentId, Guid UserId, Guid RoleId) : IRequest<DownloadDocumentResult>;