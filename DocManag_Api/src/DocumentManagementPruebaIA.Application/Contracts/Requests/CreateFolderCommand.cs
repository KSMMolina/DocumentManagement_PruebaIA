namespace DocumentManagementPruebaIA.Application.Contracts.Requests;

public sealed record CreateFolderCommand(Guid PropertyId, string Name, Guid? ParentFolderId, int? DesiredOrder);
