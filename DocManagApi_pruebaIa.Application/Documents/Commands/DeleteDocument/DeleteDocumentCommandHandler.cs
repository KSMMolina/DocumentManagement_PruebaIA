using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.DeleteDocument;

public sealed class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand, Unit>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public DeleteDocumentCommandHandler(IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Unit> Handle(DeleteDocumentCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        var doc = folder.Documents.FirstOrDefault(d => d.Id == request.DocumentId)
            ?? throw new InvalidOperationException("Document.NotFound");

        doc.Delete();
        _folderRepo.Update(folder);
        await _uow.SaveChangesAsync(ct);

        return Unit.Value;
    }
}