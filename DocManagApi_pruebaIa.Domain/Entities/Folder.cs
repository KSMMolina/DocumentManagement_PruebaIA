using DocManagApi_pruebaIa.Domain.Common.Abstractions;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;
using DocManagApi_pruebaIa.Domain.Events;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class Folder : IAggregateRoot
{
    private readonly List<Folder> _children = new();
    private readonly List<Document> _documents = new();
    private readonly List<FolderPermission> _permissions = new();
    private readonly List<IDomainEvent> _domainEvents = new();

    public Guid Id { get; private set; }
    public Guid PropertyId { get; private set; }
    public Guid? ParentFolderId { get; private set; }
    public Depth Depth { get; private set; } = Depth.Create(1);
    public FolderName Name { get; private set; } = FolderName.Create("placeholder");
    public string? Description { get; private set; }
    public bool IsDeleted { get; private set; }

    public IReadOnlyCollection<Folder> Children => _children.AsReadOnly();
    public IReadOnlyCollection<Document> Documents => _documents.AsReadOnly();
    public IReadOnlyCollection<FolderPermission> Permissions => _permissions.AsReadOnly();
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    internal Folder() { }

    private Folder(Guid id, Guid propertyId, Guid? parentId, Depth depth, FolderName name, string? description)
    {
        Id = id;
        PropertyId = propertyId;
        ParentFolderId = parentId;
        Depth = depth;
        Name = name;
        Description = description;
        _domainEvents.Add(new FolderCreatedEvent(Id, PropertyId, ParentFolderId, Depth.Value, Name.Value));
    }

    public static Folder CreateRoot(Guid propertyId, FolderName name, string? description = null)
        => new(Guid.NewGuid(), propertyId, null, Depth.Create(1), name, description);

    public Folder AddSubfolder(FolderName name, string? description = null)
    {
        if (Depth.Value >= 3)
            throw new MaxDepthExceededDomainException();
        if (_children.Count(c => !c.IsDeleted) >= 2)
            throw new MaxSubfoldersExceededDomainException();
        if (_children.Any(c => !c.IsDeleted && c.Name.Equals(name)))
            throw new DuplicateNameDomainException("Folder", name.Value);

        var child = new Folder(Guid.NewGuid(), PropertyId, Id, Depth.Increment(), name, description);
        _children.Add(child);
        return child;
    }

    public Document AddDocument(DocumentName name, FileSize size, FileDescription? description = null)
    {
        if (_documents.Count(d => !d.IsDeleted) >= 5)
            throw new MaxDocumentsExceededDomainException();
        if (_documents.Any(d => !d.IsDeleted && d.Name.Equals(name)))
            throw new DuplicateNameDomainException("Document", name.Value);

        var doc = Document.Create(Id, name, size, description);
        _documents.Add(doc);
        _domainEvents.Add(new DocumentUploadedEvent(doc.Id, Id, doc.Name.Value, doc.Size.Value));
        return doc;
    }

    public void Rename(FolderName newName)
    {
        if (Name.Equals(newName)) return;
        var old = Name.Value;
        Name = newName;
        _domainEvents.Add(new FolderRenamedEvent(Id, old, newName.Value));
    }

    public void Delete()
    {
        if (IsDeleted) return;
        IsDeleted = true;
        _domainEvents.Add(new FolderDeletedEvent(Id));
    }

    public static Folder Rehydrate(
        Guid id,
        Guid propertyId,
        Guid? parentId,
        int depth,
        string name,
        string? description,
        bool isDeleted,
        IEnumerable<Document> documents,
        IEnumerable<FolderPermission> permissions,
        IEnumerable<Folder> children)
    {
        var folder = new Folder
        {
            Id = id,
            PropertyId = propertyId,
            ParentFolderId = parentId,
            Depth = Depth.Create(depth),
            Name = FolderName.Create(name),
            Description = description,
            IsDeleted = isDeleted
        };

        folder._documents.AddRange(documents);
        folder._permissions.AddRange(permissions);
        folder._children.AddRange(children);
        return folder;
    }

    public void AssignPermissions(
        Guid roleId,
        IEnumerable<Guid> permissionTypeIds,
        IEnumerable<(Guid roleId, string roleCode)> roleCatalog,
        IEnumerable<(Guid permId, string permCode)> permCatalog)
    {
        var roleCode = roleCatalog.First(rc => rc.roleId == roleId).roleCode;
        var addedCodes = new List<string>();

        foreach (var permId in permissionTypeIds)
        {
            if (_permissions.Any(p => p.RoleId == roleId && p.PermissionTypeId == permId))
                continue;
            var permCode = permCatalog.First(pc => pc.permId == permId).permCode;
            var fp = new FolderPermission(Guid.NewGuid(), Id, roleId, permId);
            _permissions.Add(fp);
            addedCodes.Add(permCode);
        }

        if (addedCodes.Count > 0)
            _domainEvents.Add(new FolderPermissionsAssignedEvent(Id, roleId, addedCodes));
    }

    public void RevokePermissions(
        Guid roleId,
        IEnumerable<Guid> permissionTypeIds,
        IEnumerable<(Guid roleId, string roleCode)> roleCatalog,
        IEnumerable<(Guid permId, string permCode)> permCatalog)
    {
        var roleCode = roleCatalog.First(rc => rc.roleId == roleId).roleCode;
        if (roleCode == "ADMINISTRADOR")
            throw new CannotRevokeAdminPermissionDomainException();

        var revokedCodes = new List<string>();
        foreach (var permId in permissionTypeIds)
        {
            var existing = _permissions.FirstOrDefault(p => p.RoleId == roleId && p.PermissionTypeId == permId);
            if (existing is null) continue;
            _permissions.Remove(existing);
            var permCode = permCatalog.First(pc => pc.permId == permId).permCode;
            revokedCodes.Add(permCode);
        }

        if (revokedCodes.Count > 0)
            _domainEvents.Add(new FolderPermissionsRevokedEvent(Id, roleId, revokedCodes));
    }

    public void ClearDomainEvents() => _domainEvents.Clear();
}