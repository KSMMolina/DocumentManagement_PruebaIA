using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IFolderRepository
{
    Task<Folder?> GetByIdAsync(Guid folderId, CancellationToken ct);
    Task AddAsync(Folder folder, CancellationToken ct);
    void Update(Folder folder);
    // Opcional: cargar subárbol o proyecciones
    Task<bool> ExistsByNameAtLevelAsync(Guid propertyId, Guid? parentFolderId, string folderName, CancellationToken ct);
}