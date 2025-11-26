using DocumentManagementPruebaIA.Application.Interfaces;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Repositories;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly DocumentManagementDbContext _dbContext;

    public UnitOfWork(DocumentManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
