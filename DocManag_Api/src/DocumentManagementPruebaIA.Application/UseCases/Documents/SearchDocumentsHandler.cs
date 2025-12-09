using DocumentManagementPruebaIA.Application.Contracts.DTOs;
using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.Interfaces;

namespace DocumentManagementPruebaIA.Application.UseCases.Documents;

public sealed class SearchDocumentsHandler
{
    private readonly IDocumentRepository _documentRepository;

    public SearchDocumentsHandler(IDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<IReadOnlyCollection<DocumentDto>> HandleAsync(SearchDocumentsQuery query, CancellationToken cancellationToken)
    {
        var documents = await _documentRepository.SearchAsync(query.PropertyId, query.FolderNameFilter, query.FileNameFilter, cancellationToken);
        return documents.Select(doc => new DocumentDto(doc.Id, doc.Name.Value, doc.Description.Value, doc.Size.Value, doc.CreatedAt, doc.FolderId)).ToList();
    }
}
