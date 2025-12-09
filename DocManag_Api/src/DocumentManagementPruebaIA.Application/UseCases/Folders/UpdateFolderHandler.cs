using DocumentManagementPruebaIA.Application.Contracts.DTOs;
using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Exceptions;
using DocumentManagementPruebaIA.Domain.ValueObjects;

namespace DocumentManagementPruebaIA.Application.UseCases.Folders;

public sealed class UpdateFolderHandler
{
    private readonly IFolderRepository _folderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateFolderHandler(IFolderRepository folderRepository, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<FolderDto> HandleAsync(UpdateFolderCommand command, CancellationToken cancellationToken)
    {
        var folder = await _folderRepository.GetByIdAsync(command.FolderId, cancellationToken) ?? throw new DomainRuleViolationException("La carpeta no existe.");

        folder.UpdateName(FolderName.Create(command.Name));

        if (command.DesiredOrder is not null)
        {
            folder.UpdateSiblingOrder(SiblingOrder.Create(command.DesiredOrder.Value));
        }

        await _folderRepository.SaveAsync(folder, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new FolderDto(folder.Id, folder.Name.Value, folder.Depth.Value, folder.ParentFolderId);
    }
}
