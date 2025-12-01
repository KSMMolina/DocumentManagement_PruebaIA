using DocManagApi_pruebaIa.Application.Abstractions.Persistence;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly DocumentManagementDbContext _db;
    public UnitOfWork(DocumentManagementDbContext db) => _db = db;
    public Task<int> SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}