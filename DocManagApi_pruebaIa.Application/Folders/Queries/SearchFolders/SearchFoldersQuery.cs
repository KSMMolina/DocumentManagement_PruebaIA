using DocManagApi_pruebaIa.Application.Folders.Dtos;
using MediatR;

namespace DocManagApi_pruebaIa.Application.Folders.Queries.SearchFolders;

public sealed record SearchFoldersQuery(Guid PropertyId, string NameLike, int Take = 50) : IRequest<IReadOnlyCollection<SearchFolderResultDto>>;
