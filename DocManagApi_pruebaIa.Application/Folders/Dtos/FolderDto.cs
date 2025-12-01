namespace DocManagApi_pruebaIa.Application.Folders.Dtos;

public sealed record FolderDto(
    Guid Id,
    Guid? ParentFolderId,
    Guid PropertyId,
    string Name,
    string? Description,
    int Depth);