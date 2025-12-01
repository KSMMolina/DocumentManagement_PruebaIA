using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IDocumentRepository
{
    Task<Document?> GetByIdAsync(Guid documentId, CancellationToken ct);
    Task<IReadOnlyCollection<Document>> GetByFolderAndNameAsync(Guid folderId, string? nameLike, CancellationToken ct);
}