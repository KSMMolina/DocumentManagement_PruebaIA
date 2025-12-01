using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLogEntry entry, CancellationToken ct);
}