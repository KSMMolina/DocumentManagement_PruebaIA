using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UpdateDocument;

public sealed class UpdateDocumentCommandHandler : IRequestHandler<UpdateDocumentCommand, Unit>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public UpdateDocumentCommandHandler(IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Unit> Handle(UpdateDocumentCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        var doc = folder.Documents.FirstOrDefault(d => d.Id == request.DocumentId)
            ?? throw new InvalidOperationException("Document.NotFound");
        if (doc.IsDeleted)
            throw new InvalidOperationException("Document.Deleted");

        var name = DocumentName.Create(request.Name);
        var desc = Domain.ValueObjects.FileDescription.Create(request.Description);

        // Validar duplicado de nombre dentro de carpeta
        if (folder.Documents.Any(d => d.Id != doc.Id && !d.IsDeleted && d.Name.Equals(name)))
            throw new InvalidOperationException("Document.DuplicateName");

        doc.Update(name, desc);

        _folderRepo.Update(folder);
        await _uow.SaveChangesAsync(ct);

        return Unit.Value;
    }
}