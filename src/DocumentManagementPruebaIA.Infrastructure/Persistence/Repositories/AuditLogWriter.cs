using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Entities;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Repositories;

public sealed class AuditLogWriter : IAuditLogWriter
{
    private readonly DocumentManagementDbContext _dbContext;

    public AuditLogWriter(DocumentManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(AuditLog log, CancellationToken cancellationToken)
    {
        await _dbContext.AuditLogs.AddAsync(log, cancellationToken);
    }
}
