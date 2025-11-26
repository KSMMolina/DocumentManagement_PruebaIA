using DocumentManagementPruebaIA.Application.Contracts.DTOs;
using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Entities;
using DocumentManagementPruebaIA.Domain.Exceptions;
using DocumentManagementPruebaIA.Domain.ValueObjects;

namespace DocumentManagementPruebaIA.Application.UseCases.Documents;

public sealed class StoreDocumentHandler
{
    private readonly IFolderRepository _folderRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IAuditLogWriter _auditLogWriter;
    private readonly IUnitOfWork _unitOfWork;

    public StoreDocumentHandler(IFolderRepository folderRepository, IDocumentRepository documentRepository, IAuditLogWriter auditLogWriter, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _documentRepository = documentRepository;
        _auditLogWriter = auditLogWriter;
        _unitOfWork = unitOfWork;
    }

    public async Task<DocumentDto> HandleAsync(StoreDocumentCommand command, CancellationToken cancellationToken)
    {
        var folder = await _folderRepository.GetByIdAsync(command.FolderId, cancellationToken) ?? throw new DomainRuleViolationException("La carpeta destino no existe.");
        var documents = await _documentRepository.GetByFolderAsync(command.FolderId, cancellationToken);
        if (documents.Count >= DocumentSlot.MaxDocumentsPerFolder)
        {
            throw new DomainRuleViolationException($"La carpeta alcanzó el máximo de {DocumentSlot.MaxDocumentsPerFolder} archivos.");
        }

        var document = new DocumentFile(Guid.NewGuid(), folder.Id, FileName.Create(command.Name), FileDescription.From(command.Description), FileSize.FromBytes(command.SizeInBytes), documents.Count + 1, DateTimeOffset.UtcNow);

        await _documentRepository.AddAsync(document, cancellationToken);
        await _auditLogWriter.AddAsync(new AuditLog(Guid.NewGuid(), "DOCUMENT_UPLOADED", "system", UserRole.Administrator.ToString(), DateTimeOffset.UtcNow, "Archivo agregado", folder.Id, document.Id), cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DocumentDto(document.Id, document.Name.Value, document.Description.Value, document.Size.Value, document.CreatedAt, folder.Id);
    }
}
