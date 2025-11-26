namespace DocumentManagementPruebaIA.Domain.Events;

public sealed record DocumentStoredEvent(Guid DocumentId, Guid FolderId, long Size, DateTimeOffset OccurredOn);
