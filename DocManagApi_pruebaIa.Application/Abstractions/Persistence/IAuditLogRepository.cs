using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLogEntry entry, CancellationToken ct);

    //To do: Organizar un dto para enviar un unico objeto con los parametros de busqueda
    Task<IReadOnlyCollection<AuditLogEntry>> SearchAsync(
        Guid? userId,
        Guid? roleId,
        Guid? propertyId,
        Guid? folderId,
        Guid? documentId,
        Guid? actionTypeId,
        DateTime? fromUtc,
        DateTime? toUtc,
        int take,
        CancellationToken ct);
}