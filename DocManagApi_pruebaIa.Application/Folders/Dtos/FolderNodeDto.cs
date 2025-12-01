namespace DocManagApi_pruebaIa.Application.Folders.Dtos
{
    public sealed record FolderNodeDto(Guid Id, Guid? ParentId, string Name, int Depth);
}
