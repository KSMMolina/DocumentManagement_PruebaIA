namespace DocumentManagementPruebaIA.Application.Contracts.DTOs;

public sealed record FolderDto(Guid Id, string Name, int Depth, Guid? ParentFolderId);
