using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Folders.Dtos;

namespace DocManagApi_pruebaIa.Application.Folders.Queries.SearchFolders;

public sealed class SearchFoldersQueryHandler : IRequestHandler<SearchFoldersQuery, IReadOnlyCollection<SearchFolderResultDto>>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IPropertyRepository _propertyRepo;

    public SearchFoldersQueryHandler(IFolderRepository folderRepo, IPropertyRepository propertyRepo)
    {
        _folderRepo = folderRepo;
        _propertyRepo = propertyRepo;
    }

    public async Task<IReadOnlyCollection<SearchFolderResultDto>> Handle(SearchFoldersQuery request, CancellationToken ct)
    {
        var property = await _propertyRepo.GetByIdAsync(request.PropertyId, ct)
            ?? throw new InvalidOperationException("Property.NotFound");

        var folders = await _folderRepo.SearchByNameAsync(property.Id, request.NameLike, request.Take, ct);

        return folders
            .Select(f => new SearchFolderResultDto
            {
                Id = f.Id,
                Name = f.Name.Value,
                Depth = f.Depth.Value,
                ParentFolderId = f.ParentFolderId
            })
            .ToList();
    }
}