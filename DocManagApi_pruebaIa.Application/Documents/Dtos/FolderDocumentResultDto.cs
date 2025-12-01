namespace DocManagApi_pruebaIa.Application.Documents.Dtos
{
    public sealed class FolderDocumentResultDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = default!;
        public long SizeBytes { get; init; }
        public bool IsDeleted { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
