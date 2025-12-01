using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DocManagApi_pruebaIa.Infrastructure.Repositories;

public sealed class AuditLogRepository : IAuditLogRepository
{
    private readonly DocumentManagementDbContext _db;

    public AuditLogRepository(DocumentManagementDbContext db) => _db = db;

    public Task AddAsync(AuditLogEntry entry, CancellationToken ct)
    {
        _db.AuditLogs.Add(entry);
        return Task.CompletedTask;
    }

    public async Task<IReadOnlyCollection<AuditLogEntry>> GetByUserAsync(Guid userId, int take, CancellationToken ct)
    {
        return await _db.AuditLogs
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.OccurredAt)
            .Take(take)
            .ToListAsync(ct);
    }
}