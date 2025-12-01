using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IDocumentRepository
{
    Task<Document?> GetByIdAsync(Guid documentId, CancellationToken ct);
    // Generalmente se gestiona por agregado Folder, pero dejamos interfaz para consultas específicas
}