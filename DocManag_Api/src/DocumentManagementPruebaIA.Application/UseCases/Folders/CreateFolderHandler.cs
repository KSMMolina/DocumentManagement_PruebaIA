using DocumentManagementPruebaIA.Application.Contracts.DTOs;
using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Entities;
using DocumentManagementPruebaIA.Domain.Events;
using DocumentManagementPruebaIA.Domain.Exceptions;
using DocumentManagementPruebaIA.Domain.ValueObjects;

namespace DocumentManagementPruebaIA.Application.UseCases.Folders;

public sealed class CreateFolderHandler
{
    private readonly IFolderRepository _folderRepository;
    private readonly IAuditLogWriter _auditLogWriter;
    private readonly IUnitOfWork _unitOfWork;

    public CreateFolderHandler(IFolderRepository folderRepository, IAuditLogWriter auditLogWriter, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _auditLogWriter = auditLogWriter;
        _unitOfWork = unitOfWork;
    }

    public async Task<FolderDto> HandleAsync(CreateFolderCommand command, CancellationToken cancellationToken)
    {
        FolderDepth depth;
        if (command.ParentFolderId is null)
        {
            depth = FolderDepth.Create(1);
        }
        else
        {
            var parent = await _folderRepository.GetByIdAsync(command.ParentFolderId.Value, cancellationToken) ?? throw new DomainRuleViolationException("La carpeta padre no existe.");
            depth = FolderDepth.Create(parent.Depth.Value + 1);
        }
        var siblingCount = await _folderRepository.CountSiblingsAsync(command.ParentFolderId, command.PropertyId, cancellationToken);

        var orderToUse = command.DesiredOrder ?? siblingCount + 1;
        var siblingOrder = SiblingOrder.Create(orderToUse);

        var folder = new Folder(Guid.NewGuid(), command.PropertyId, FolderName.Create(command.Name), depth, siblingOrder, command.ParentFolderId);

        await _folderRepository.AddAsync(folder, cancellationToken);
        await _auditLogWriter.AddAsync(new AuditLog(Guid.NewGuid(), "FOLDER_CREATED", "system", UserRole.Administrator.ToString(), DateTimeOffset.UtcNow, "Carpeta creada", folder.Id, null), cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _ = new FolderCreatedEvent(folder.Id, folder.PropertyId, folder.ParentFolderId, DateTimeOffset.UtcNow);

        return new FolderDto(folder.Id, folder.Name.Value, folder.Depth.Value, folder.ParentFolderId);
    }
}
