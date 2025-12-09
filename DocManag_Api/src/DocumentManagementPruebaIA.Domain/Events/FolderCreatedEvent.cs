namespace DocumentManagementPruebaIA.Domain.Events;

public sealed record FolderCreatedEvent(Guid FolderId, Guid PropertyId, Guid? ParentFolderId, DateTimeOffset OccurredOn);
