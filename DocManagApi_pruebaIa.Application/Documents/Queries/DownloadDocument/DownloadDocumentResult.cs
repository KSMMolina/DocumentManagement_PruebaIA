namespace DocManagApi_pruebaIa.Application.Documents.Queries.DownloadDocument;

public sealed class DownloadDocumentResult
{
    public Guid DocumentId { get; init; }
    public string Name { get; init; } = default!;
    public long SizeBytes { get; init; }
    // El stream/binario se gestiona en Infrastructure/Presentation; aquí retornamos metadatos.
}