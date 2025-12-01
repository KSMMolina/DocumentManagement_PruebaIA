using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DocManagApi_pruebaIa.Infrastructure.Repositories;

public sealed class FolderRepository : IFolderRepository
{
    private readonly DocumentManagementDbContext _db;

    public FolderRepository(DocumentManagementDbContext db) => _db = db;

    public async Task<Folder?> GetByIdAsync(Guid folderId, CancellationToken ct)
    {
        // Carpeta base
        var f = await _db.Folders.AsNoTracking().FirstOrDefaultAsync(x => x.Id == folderId, ct);
        if (f is null) return null;

        var docsRaw = await _db.Documents.AsNoTracking()
            .Where(d => d.FolderId == folderId)
            .ToListAsync(ct);

        // Permisos
        var permsRaw = await _db.FolderPermissions.AsNoTracking()
            .Where(p => p.FolderId == folderId)
            .ToListAsync(ct);

        // Hijos directos (árbol superficial)
        var childrenRaw = await _db.Folders.AsNoTracking()
            .Where(c => c.ParentFolderId == folderId)
            .ToListAsync(ct);

        var children = childrenRaw.Select(ch =>
            Folder.Rehydrate(
                id: ch.Id,
                propertyId: ch.PropertyId,
                parentId: ch.ParentFolderId,
                depth: ch.Depth.Value,
                name: ch.Name.Value,
                description: ch.Description,
                isDeleted: ch.IsDeleted,
                documents: Enumerable.Empty<Document>(),
                permissions: Enumerable.Empty<FolderPermission>(),
                children: Enumerable.Empty<Folder>())
        ).ToList();

        // Rehidratación carpeta raíz (inyectamos documentos y permisos materializados)
        var folder = Folder.Rehydrate(
            id: f.Id,
            propertyId: f.PropertyId,
            parentId: f.ParentFolderId,
            depth: f.Depth.Value,
            name: f.Name.Value,
            description: f.Description,
            isDeleted: f.IsDeleted,
            documents: docsRaw,
            permissions: permsRaw,
            children: children);

        return folder;
    }

    public async Task AddAsync(Folder folder, CancellationToken ct)
    {
        // Determinar slot (1..2) libre
        short childSlot;
        if (folder.ParentFolderId is null)
        {
            var used = await _db.Folders
                .Where(x => x.PropertyId == folder.PropertyId && x.ParentFolderId == null)
                .Select(x => EF.Property<short>(x, "child_slot"))
                .ToListAsync(ct);
            childSlot = FirstFreeSlot(used, 2);
        }
        else
        {
            var used = await _db.Folders
                .Where(x => x.ParentFolderId == folder.ParentFolderId)
                .Select(x => EF.Property<short>(x, "child_slot"))
                .ToListAsync(ct);
            childSlot = FirstFreeSlot(used, 2);
        }

        _db.Folders.Add(folder);
        _db.Entry(folder).Property("child_slot").CurrentValue = childSlot;
        _db.Entry(folder).Property("created_at").CurrentValue = DateTimeOffset.UtcNow;

        // Documentos iniciales (normalmente vacío)
        short slot = 1;
        foreach (var doc in folder.Documents)
        {
            _db.Documents.Add(doc);
            _db.Entry(doc).Property("file_slot").CurrentValue = slot++;
            _db.Entry(doc).Property("created_at").CurrentValue = doc.CreatedAt;
        }

        // Permisos iniciales
        foreach (var perm in folder.Permissions)
        {
            _db.FolderPermissions.Add(perm);
            _db.Entry(perm).Property("granted_at").CurrentValue = perm.GrantedAt;
        }
    }

    public void Update(Folder folder)
    {
        _db.Folders.Update(folder);

        // Documentos nuevos (slots libres)
        var existingDocs = _db.Documents
            .Where(d => d.FolderId == folder.Id)
            .Select(d => new { d.Id, Slot = EF.Property<short>(d, "file_slot") })
            .ToList();

        var existingDocIds = existingDocs.Select(x => x.Id).ToHashSet();
        var usedSlots = existingDocs.Select(x => x.Slot).ToHashSet();

        foreach (var doc in folder.Documents.Where(d => !existingDocIds.Contains(d.Id)))
        {
            var freeSlot = FirstFreeSlot(usedSlots, 5);
            if (freeSlot == 0)
                throw new InvalidOperationException("Slots de documento llenos (1..5).");

            usedSlots.Add(freeSlot);
            _db.Documents.Add(doc);
            _db.Entry(doc).Property("file_slot").CurrentValue = freeSlot;
            _db.Entry(doc).Property("created_at").CurrentValue = doc.CreatedAt;
        }

        // Permisos nuevos
        var existingPermIds = _db.FolderPermissions
            .Where(p => p.FolderId == folder.Id)
            .Select(p => p.Id)
            .ToHashSet();

        foreach (var perm in folder.Permissions.Where(p => !existingPermIds.Contains(p.Id)))
        {
            _db.FolderPermissions.Add(perm);
            _db.Entry(perm).Property("granted_at").CurrentValue = perm.GrantedAt;
        }
    }

    public Task<bool> ExistsByNameAtLevelAsync(Guid propertyId, Guid? parentFolderId, string folderName, CancellationToken ct)
        => _db.Folders.AnyAsync(x => x.PropertyId == propertyId && x.ParentFolderId == parentFolderId && x.Name.Value == folderName, ct);

    public async Task<IReadOnlyCollection<Folder>> GetChildrenAsync(Guid parentFolderId, CancellationToken ct)
    {
        var childrenRaw = await _db.Folders.AsNoTracking()
            .Where(f => f.ParentFolderId == parentFolderId)
            .ToListAsync(ct);

        return childrenRaw.Select(ch =>
            Folder.Rehydrate(ch.Id, ch.PropertyId, ch.ParentFolderId, ch.Depth.Value, ch.Name.Value, ch.Description, ch.IsDeleted,
                documents: Enumerable.Empty<Document>(),
                permissions: Enumerable.Empty<FolderPermission>(),
                children: Enumerable.Empty<Folder>())
        ).ToList();
    }

    private static short FirstFreeSlot(IEnumerable<short> used, short max)
    {
        for (short i = 1; i <= max; i++)
            if (!used.Contains(i))
                return i;
        return 0;
    }
}