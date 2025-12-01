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
        return Task.CompletedTask; // el commit se hace en IUnitOfWork.SaveChangesAsync
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

    public async Task<IReadOnlyCollection<AuditLogEntry>> SearchAsync(
        Guid? userId,
        Guid? roleId,
        Guid? propertyId,
        Guid? folderId,
        Guid? documentId,
        Guid? actionTypeId,
        DateTime? fromUtc,
        DateTime? toUtc,
        int take,
        CancellationToken ct)
    {
        var query = _db.AuditLogs.AsNoTracking().AsQueryable();

        if (userId is not null)
            query = query.Where(a => a.UserId == userId);
        if (roleId is not null)
            query = query.Where(a => a.RoleId == roleId);
        if (propertyId is not null)
            query = query.Where(a => a.PropertyId == propertyId);
        if (folderId is not null)
            query = query.Where(a => a.FolderId == folderId);
        if (documentId is not null)
            query = query.Where(a => a.DocumentId == documentId);
        if (actionTypeId is not null)
            query = query.Where(a => a.ActionTypeId == actionTypeId);
        if (fromUtc is not null)
            query = query.Where(a => a.OccurredAt >= fromUtc);
        if (toUtc is not null)
            query = query.Where(a => a.OccurredAt <= toUtc);

        if (take <= 0) take = 100;

        return await query
            .OrderByDescending(a => a.OccurredAt)
            .Take(take)
            .ToListAsync(ct);
    }
}