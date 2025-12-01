using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DocManagApi_pruebaIa.Infrastructure.Repositories;

public sealed class DocumentRepository : IDocumentRepository
{
    private readonly DocumentManagementDbContext _db;
    public DocumentRepository(DocumentManagementDbContext db) => _db = db;

    public Task<Document?> GetByIdAsync(Guid documentId, CancellationToken ct)
        => _db.Documents.AsNoTracking().FirstOrDefaultAsync(d => d.Id == documentId, ct);

    public async Task<IReadOnlyCollection<Document>> GetByFolderAndNameAsync(Guid folderId, string? nameLike, CancellationToken ct)
    {
        var query = _db.Documents.AsNoTracking()
            .Where(d => d.FolderId == folderId);

        if (!string.IsNullOrWhiteSpace(nameLike))
        {
            var needle = nameLike.Trim().ToLowerInvariant();
            query = query.Where(d => d.Name.Value.ToLower()!.Contains(needle));
        }

        return await query
            .OrderBy(d => d.Name.Value)
            .ToListAsync(ct);
    }
}