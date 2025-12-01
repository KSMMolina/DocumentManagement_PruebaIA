using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UpdateDocument;

public sealed class UpdateDocumentCommandHandler : IRequestHandler<UpdateDocumentCommand, Result<Unit>>
{
    private readonly IDocumentRepository _docRepo;
    private readonly IUnitOfWork _uow;

    public UpdateDocumentCommandHandler(IDocumentRepository docRepo, IUnitOfWork uow)
    {
        _docRepo = docRepo;
        _uow = uow;
    }

    public async Task<Result<Unit>> Handle(UpdateDocumentCommand request, CancellationToken ct)
    {
        var doc = await _docRepo.GetByIdAsync(request.DocumentId, ct);
        if (doc is null)
            return Result<Unit>.Failure(new Error("Document.NotFound", "No se encontró el documento."));
        if (doc.IsDeleted)
            return Result<Unit>.Failure(new Error("Document.Deleted", "El documento está eliminado."));

        try
        {
            var name = string.IsNullOrWhiteSpace(request.Name) ? doc.Name : DocumentName.Create(request.Name!);
            var desc = request.Description is null ? doc.Description : FileDescription.Create(request.Description);

            doc.Update(name, desc);
            await _uow.SaveChangesAsync(ct);

            return Result<Unit>.Success(Unit.Value);
        }
        catch (DomainException ex)
        {
            return Result<Unit>.Failure(DomainExceptionMapper.ToError(ex));
        }
    }
}