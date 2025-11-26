using DocumentManagementPruebaIA.Application.Contracts.DTOs;
using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Exceptions;
using DocumentManagementPruebaIA.Domain.ValueObjects;

namespace DocumentManagementPruebaIA.Application.UseCases.Documents;

public sealed class UpdateDocumentHandler
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateDocumentHandler(IDocumentRepository documentRepository, IUnitOfWork unitOfWork)
    {
        _documentRepository = documentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DocumentDto> HandleAsync(UpdateDocumentCommand command, CancellationToken cancellationToken)
    {
        var document = await _documentRepository.GetByIdAsync(command.DocumentId, cancellationToken) ?? throw new DomainRuleViolationException("El archivo no existe.");

        document.UpdateMetadata(FileName.Create(command.Name), FileDescription.From(command.Description));
        await _documentRepository.UpdateAsync(document, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DocumentDto(document.Id, document.Name.Value, document.Description.Value, document.Size.Value, document.CreatedAt, document.FolderId);
    }
}
