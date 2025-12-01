using DocManagApi_pruebaIa.Application.Documents.Dtos;
using MediatR;

namespace DocManagApi_pruebaIa.Application.Documents.Queries.GetDocumentsByFolder;

public sealed record GetDocumentsByFolderQuery(Guid FolderId, string? NameLike) : IRequest<IReadOnlyCollection<FolderDocumentResultDto>>;