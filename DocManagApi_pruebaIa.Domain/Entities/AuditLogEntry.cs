using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class AuditLogEntry : IEntity
{
    public Guid Id { get; }
    public DateTime OccurredAt { get; }
    public Guid UserId { get; }
    public Guid? RoleId { get; }
    public Guid? PropertyId { get; }
    public Guid ActionTypeId { get; }
    public Guid? FolderId { get; }
    public Guid? DocumentId { get; }
    public string Detail { get; }

    public AuditLogEntry(Guid id, Guid userId, Guid? roleId, Guid? propertyId, Guid actionTypeId, Guid? folderId, Guid? documentId, string? detail)
    {
        Id = id;
        UserId = userId;
        RoleId = roleId;
        PropertyId = propertyId;
        ActionTypeId = actionTypeId;
        FolderId = folderId;
        DocumentId = documentId;
        Detail = detail ?? string.Empty;
        OccurredAt = DateTime.UtcNow;
    }
}