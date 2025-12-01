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
}