namespace DocumentManagementPruebaIA.Application.Contracts.Requests;

public sealed record StoreDocumentCommand(Guid FolderId, string Name, string Description, long SizeInBytes);
