namespace DocumentManagementPruebaIA.Application.Contracts.Requests;

public sealed record UpdateDocumentCommand(Guid DocumentId, string Name, string Description);
