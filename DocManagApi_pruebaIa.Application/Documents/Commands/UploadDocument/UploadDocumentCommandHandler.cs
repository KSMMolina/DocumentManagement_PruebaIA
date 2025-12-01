using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UploadDocument;

public sealed class UploadDocumentCommandHandler : IRequestHandler<UploadDocumentCommand, Guid>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IAuditLogRepository _auditRepo;
    private readonly IUnitOfWork _uow;

    public UploadDocumentCommandHandler(IFolderRepository folderRepo, IAuditLogRepository auditRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _auditRepo = auditRepo;
        _uow = uow;
    }

    public async Task<Guid> Handle(UploadDocumentCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");
        if (folder.IsDeleted)
            throw new InvalidOperationException("Folder.Deleted");

        var name = DocumentName.Create(request.Name);
        var size = FileSize.Create(request.SizeBytes);
        var desc = Domain.ValueObjects.FileDescription.Create(request.Description);

        var doc = folder.AddDocument(name, size, desc);

        _folderRepo.Update(folder);
        await _uow.SaveChangesAsync(ct);

        return doc.Id;
    }
}