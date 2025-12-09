using DocumentManagementPruebaIA.Domain.Entities;

namespace DocumentManagementPruebaIA.Application.Interfaces;

public interface IDocumentRepository
{
    Task<IReadOnlyCollection<DocumentFile>> GetByFolderAsync(Guid folderId, CancellationToken cancellationToken);

    Task<DocumentFile?> GetByIdAsync(Guid documentId, CancellationToken cancellationToken);

    Task AddAsync(DocumentFile document, CancellationToken cancellationToken);

    Task UpdateAsync(DocumentFile document, CancellationToken cancellationToken);

    Task<IReadOnlyCollection<DocumentFile>> SearchAsync(Guid propertyId, string? folderNameFilter, string? fileNameFilter, CancellationToken cancellationToken);
}
