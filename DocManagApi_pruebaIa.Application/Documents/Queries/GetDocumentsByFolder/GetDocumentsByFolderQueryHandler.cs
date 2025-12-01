using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Documents.Dtos;
using MediatR;

namespace DocManagApi_pruebaIa.Application.Documents.Queries.GetDocumentsByFolder;

public sealed class GetDocumentsByFolderQueryHandler : IRequestHandler<GetDocumentsByFolderQuery, IReadOnlyCollection<FolderDocumentResultDto>>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IDocumentRepository _docRepo;

    public GetDocumentsByFolderQueryHandler(IFolderRepository folderRepo, IDocumentRepository docRepo)
    {
        _folderRepo = folderRepo;
        _docRepo = docRepo;
    }

    public async Task<IReadOnlyCollection<FolderDocumentResultDto>> Handle(GetDocumentsByFolderQuery request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        var docs = await _docRepo.GetByFolderAndNameAsync(folder.Id, request.NameLike, ct);

        return docs.Select(d => new FolderDocumentResultDto
        {
            Id = d.Id,
            Name = d.Name.Value,
            SizeBytes = d.Size.Value,
            IsDeleted = d.IsDeleted,
            CreatedAt = d.CreatedAt
        }).ToList();
    }
}