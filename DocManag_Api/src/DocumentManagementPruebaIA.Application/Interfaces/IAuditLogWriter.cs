using DocumentManagementPruebaIA.Domain.Entities;

namespace DocumentManagementPruebaIA.Application.Interfaces;

public interface IAuditLogWriter
{
    Task AddAsync(AuditLog log, CancellationToken cancellationToken);
}
