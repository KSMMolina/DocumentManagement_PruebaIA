using DocumentManagementPruebaIA.Domain.Abstractions;

namespace DocumentManagementPruebaIA.Domain.Entities;

public sealed class AuditLog : Entity
{
    public AuditLog(Guid id, string action, string actor, string actorRole, DateTimeOffset occurredOn, string details, Guid? folderId, Guid? documentId) : base(id)
    {
        Action = action;
        Actor = actor;
        ActorRole = actorRole;
        OccurredOn = occurredOn;
        Details = details;
        FolderId = folderId;
        DocumentId = documentId;
    }

    public string Action { get; }

    public string Actor { get; }

    public string ActorRole { get; }

    public DateTimeOffset OccurredOn { get; }

    public string Details { get; }

    public Guid? FolderId { get; }

    public Guid? DocumentId { get; }
}
