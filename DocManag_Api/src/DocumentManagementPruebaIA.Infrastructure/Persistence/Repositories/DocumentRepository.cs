using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Repositories;

public sealed class DocumentRepository : IDocumentRepository
{
    private readonly DocumentManagementDbContext _dbContext;

    public DocumentRepository(DocumentManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(DocumentFile document, CancellationToken cancellationToken)
    {
        await _dbContext.Documents.AddAsync(document, cancellationToken);
    }

    public async Task<DocumentFile?> GetByIdAsync(Guid documentId, CancellationToken cancellationToken)
    {
        return await _dbContext.Documents.FirstOrDefaultAsync(x => x.Id == documentId, cancellationToken);
    }

    public async Task<IReadOnlyCollection<DocumentFile>> GetByFolderAsync(Guid folderId, CancellationToken cancellationToken)
    {
        var documents = await _dbContext.Documents.Where(x => x.FolderId == folderId).OrderBy(x => x.Slot).ToListAsync(cancellationToken);
        return documents;
    }

    public async Task UpdateAsync(DocumentFile document, CancellationToken cancellationToken)
    {
        _dbContext.Documents.Update(document);
        await Task.CompletedTask;
    }

    public async Task<IReadOnlyCollection<DocumentFile>> SearchAsync(Guid propertyId, string? folderNameFilter, string? fileNameFilter, CancellationToken cancellationToken)
    {
        var query = from document in _dbContext.Documents
                    join folder in _dbContext.Folders on document.FolderId equals folder.Id
                    where folder.PropertyId == propertyId
                    select new { document, folder };

        if (!string.IsNullOrWhiteSpace(folderNameFilter))
        {
            query = query.Where(x => EF.Functions.ILike(EF.Property<string>(x.folder, "Name"), $"%{folderNameFilter}%"));
        }

        if (!string.IsNullOrWhiteSpace(fileNameFilter))
        {
            query = query.Where(x => EF.Functions.ILike(EF.Property<string>(x.document, "Name"), $"%{fileNameFilter}%"));
        }

        var documents = await query.Select(x => x.document).Distinct().OrderBy(x => x.CreatedAt).ToListAsync(cancellationToken);
        return documents;
    }
}
