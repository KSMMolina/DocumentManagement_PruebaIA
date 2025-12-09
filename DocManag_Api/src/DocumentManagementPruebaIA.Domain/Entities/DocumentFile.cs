using DocumentManagementPruebaIA.Domain.Abstractions;
using DocumentManagementPruebaIA.Domain.Exceptions;
using DocumentManagementPruebaIA.Domain.ValueObjects;

namespace DocumentManagementPruebaIA.Domain.Entities;

public sealed class DocumentFile : Entity
{
    public DocumentFile(Guid id, Guid folderId, FileName name, FileDescription description, FileSize size, int slot, DateTimeOffset createdAt) : base(id)
    {
        FolderId = folderId;
        Name = name;
        Description = description;
        Size = size;
        Slot = DocumentSlot.Create(slot);
        CreatedAt = createdAt;
        UpdatedAt = createdAt;
    }

    public Guid FolderId { get; }

    public FileName Name { get; private set; }

    public FileDescription Description { get; private set; }

    public FileSize Size { get; }

    public DocumentSlot Slot { get; }

    public DateTimeOffset CreatedAt { get; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public void UpdateMetadata(FileName name, FileDescription description)
    {
        Name = name;
        Description = description;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void EnsureSlotBelongsToFolder(int siblingCount)
    {
        if (siblingCount >= DocumentSlot.MaxDocumentsPerFolder)
        {
            throw new DomainRuleViolationException($"La carpeta alcanzó el máximo de {DocumentSlot.MaxDocumentsPerFolder} archivos.");
        }
    }
}
