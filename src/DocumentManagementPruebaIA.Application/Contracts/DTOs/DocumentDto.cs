namespace DocumentManagementPruebaIA.Application.Contracts.DTOs;

public sealed record DocumentDto(Guid Id, string Name, string Description, long Size, DateTimeOffset CreatedAt, Guid FolderId);
