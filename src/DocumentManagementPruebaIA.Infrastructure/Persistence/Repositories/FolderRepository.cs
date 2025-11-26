using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Repositories;

public sealed class FolderRepository : IFolderRepository
{
    private readonly DocumentManagementDbContext _dbContext;

    public FolderRepository(DocumentManagementDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Folder folder, CancellationToken cancellationToken)
    {
        await _dbContext.Folders.AddAsync(folder, cancellationToken);
    }

    public async Task<int> CountChildrenAsync(Guid folderId, CancellationToken cancellationToken)
    {
        return await _dbContext.Folders.CountAsync(x => x.ParentFolderId == folderId, cancellationToken);
    }

    public async Task<int> CountSiblingsAsync(Guid? parentFolderId, Guid propertyId, CancellationToken cancellationToken)
    {
        return await _dbContext.Folders.CountAsync(x => x.ParentFolderId == parentFolderId && x.PropertyId == propertyId, cancellationToken);
    }

    public async Task<Folder?> GetByIdAsync(Guid folderId, CancellationToken cancellationToken)
    {
        return await _dbContext.Folders
            .Include(x => x.Permissions)
            .FirstOrDefaultAsync(x => x.Id == folderId, cancellationToken);
    }

    public async Task RemoveAsync(Folder folder, CancellationToken cancellationToken)
    {
        _dbContext.Folders.Remove(folder);
        await Task.CompletedTask;
    }

    public async Task SaveAsync(Folder folder, CancellationToken cancellationToken)
    {
        _dbContext.Folders.Update(folder);
        await Task.CompletedTask;
    }
}
