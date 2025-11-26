namespace DocumentManagementPruebaIA.Application.Contracts.Requests;

public sealed record SearchDocumentsQuery(Guid PropertyId, string? FolderNameFilter, string? FileNameFilter);
