using DocumentManagementPruebaIA.Domain.Abstractions;
using DocumentManagementPruebaIA.Domain.Exceptions;
using DocumentManagementPruebaIA.Domain.ValueObjects;

namespace DocumentManagementPruebaIA.Domain.Entities;

public sealed class Folder : AggregateRoot
{
    private readonly List<Folder> _children = new();
    private readonly List<DocumentFile> _documents = new();
    private readonly List<FolderPermission> _permissions = new();

    public Folder(Guid id, Guid propertyId, FolderName name, FolderDepth depth, SiblingOrder order, Guid? parentFolderId = null) : base(id)
    {
        PropertyId = propertyId;
        Name = name;
        Depth = depth;
        ParentFolderId = parentFolderId;
        SiblingOrder = order;
    }

    public Guid PropertyId { get; }

    public FolderName Name { get; private set; }

    public FolderDepth Depth { get; }

    public Guid? ParentFolderId { get; }

    public SiblingOrder SiblingOrder { get; private set; }

    public IReadOnlyCollection<Folder> Children => _children;

    public IReadOnlyCollection<DocumentFile> Documents => _documents;

    public IReadOnlyCollection<FolderPermission> Permissions => _permissions;

    public Folder AddChildFolder(Folder child)
    {
        if (Depth.Value >= FolderDepth.MaximumDepth)
        {
            throw new DomainRuleViolationException($"No es posible crear subcarpetas más allá de la profundidad {FolderDepth.MaximumDepth}.");
        }

        if (_children.Count >= SiblingOrder.MaximumSiblings)
        {
            throw new DomainRuleViolationException($"La carpeta ya tiene el máximo de {SiblingOrder.MaximumSiblings} subcarpetas.");
        }

        _children.Add(child);
        return child;
    }

    public DocumentFile AddDocument(DocumentFile document)
    {
        if (_documents.Count >= DocumentSlot.MaxDocumentsPerFolder)
        {
            throw new DomainRuleViolationException($"La carpeta ya tiene {DocumentSlot.MaxDocumentsPerFolder} archivos.");
        }

        _documents.Add(document);
        return document;
    }

    public void UpdateName(FolderName name)
    {
        Name = name;
    }

    public void UpdateSiblingOrder(SiblingOrder order)
    {
        SiblingOrder = order;
    }

    public void AddPermission(FolderPermission permission)
    {
        var existing = _permissions.FirstOrDefault(p => p.Role == permission.Role);
        if (existing is not null)
        {
            existing.UpdateScope(permission.Scope);
            return;
        }

        _permissions.Add(permission);
    }
}
