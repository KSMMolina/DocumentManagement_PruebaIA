using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UploadDocument;

public sealed class UploadDocumentCommandHandler : IRequestHandler<UploadDocumentCommand, Result<Guid>>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public UploadDocumentCommandHandler(IFolderRepository folderRepo, IDocumentRepository docRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Result<Guid>> Handle(UploadDocumentCommand request, CancellationToken ct)
    {
        if (request.FolderId == Guid.Empty)
            return Result<Guid>.Failure(new Error("Folder.InvalidId", "El identificador de la carpeta es inválido."));
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<Guid>.Failure(new Error("Document.Name.Required", "El nombre del documento es requerido."));
        if (request.SizeBytes <= 0)
            return Result<Guid>.Failure(new Error("Document.Size.Invalid", "El tamaño del documento es inválido."));

        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct);
        if (folder is null)
            return Result<Guid>.Failure(new Error("Folder.NotFound", "No se encontró la carpeta."));
        if (folder.IsDeleted)
            return Result<Guid>.Failure(new Error("Folder.Deleted", "La carpeta está eliminada."));

        try
        {
            var name = DocumentName.Create(request.Name);
            var size = FileSize.Create(request.SizeBytes);
            var desc = FileDescription.Create(request.Description);

            var document = folder.AddDocument(name, size, desc);

            _folderRepo.Update(folder);

            await _uow.SaveChangesAsync(ct);

            return Result<Guid>.Success(document.Id);
        }
        catch (DomainException ex)
        {
            return Result<Guid>.Failure(DomainExceptionMapper.ToError(ex));
        }
    }
}