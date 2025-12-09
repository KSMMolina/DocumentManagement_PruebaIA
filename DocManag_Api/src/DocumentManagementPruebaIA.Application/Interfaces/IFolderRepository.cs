using DocumentManagementPruebaIA.Domain.Entities;

namespace DocumentManagementPruebaIA.Application.Interfaces;

public interface IFolderRepository
{
    Task<Folder?> GetByIdAsync(Guid folderId, CancellationToken cancellationToken);

    Task<int> CountSiblingsAsync(Guid? parentFolderId, Guid propertyId, CancellationToken cancellationToken);

    Task<int> CountChildrenAsync(Guid folderId, CancellationToken cancellationToken);

    Task AddAsync(Folder folder, CancellationToken cancellationToken);

    Task RemoveAsync(Folder folder, CancellationToken cancellationToken);

    Task SaveAsync(Folder folder, CancellationToken cancellationToken);
}
