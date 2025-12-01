using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IFolderRepository
{
    Task<Folder?> GetByIdAsync(Guid folderId, CancellationToken ct);
    Task AddAsync(Folder folder, CancellationToken ct);
    void Update(Folder folder);
    Task<bool> ExistsByNameAtLevelAsync(Guid propertyId, Guid? parentFolderId, string folderName, CancellationToken ct);
    Task<IReadOnlyCollection<Folder>> SearchByNameAsync(Guid propertyId, string nameLike, int take, CancellationToken ct);
    Task<IReadOnlyCollection<Folder>> GetRootFoldersAsync(Guid propertyId, CancellationToken ct);
    Task<IReadOnlyCollection<Folder>> GetFolderTreeLevelAsync(Guid propertyId, CancellationToken ct);
}