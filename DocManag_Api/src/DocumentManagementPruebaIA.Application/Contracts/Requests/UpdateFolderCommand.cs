namespace DocumentManagementPruebaIA.Application.Contracts.Requests;

public sealed record UpdateFolderCommand(Guid FolderId, string Name, int? DesiredOrder);
