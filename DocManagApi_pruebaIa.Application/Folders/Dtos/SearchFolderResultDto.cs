namespace DocManagApi_pruebaIa.Application.Folders.Dtos
{
    public sealed class SearchFolderResultDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = default!;
        public int Depth { get; init; }
        public Guid? ParentFolderId { get; init; }
    }
}
