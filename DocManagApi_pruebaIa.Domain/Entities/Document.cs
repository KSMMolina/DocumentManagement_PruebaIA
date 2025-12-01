using DocManagApi_pruebaIa.Domain.Common.Abstractions;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class Document : IEntity
{
    public Guid Id { get; private set; }
    public Guid FolderId { get; private set; }
    public DocumentName Name { get; private set; } = DocumentName.Create("placeholder");
    public FileDescription Description { get; private set; } = FileDescription.Create(string.Empty);
    public FileSize Size { get; private set; } = FileSize.Create(1);
    public bool IsDeleted { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Constructor interno sin eventos (EF / rehidratación)
    internal Document() { }

    private Document(Guid id, Guid folderId, DocumentName name, FileSize size, FileDescription description)
    {
        Id = id;
        FolderId = folderId;
        Name = name;
        Size = size;
        Description = description;
        CreatedAt = DateTime.UtcNow;
    }

    public static Document Create(Guid folderId, DocumentName name, FileSize size, FileDescription? description = null)
        => new(Guid.NewGuid(), folderId, name, size, description ?? FileDescription.Create(string.Empty));

    public void Update(DocumentName name, FileDescription description)
    {
        Name = name;
        Description = description;
    }

    public void Delete() => IsDeleted = true;

    internal static Document Rehydrate(Guid id, Guid folderId, string name, string? description, long sizeBytes, bool isDeleted, DateTime createdAt)
    {
        var doc = new Document
        {
            Id = id,
            FolderId = folderId,
            Name = DocumentName.Create(name),
            Description = FileDescription.Create(description),
            Size = FileSize.Create(sizeBytes),
            IsDeleted = isDeleted,
            CreatedAt = createdAt
        };
        return doc;
    }
}