using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Application.UseCases.Folders;

public sealed class DeleteFolderHandler
{
    private readonly IFolderRepository _folderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteFolderHandler(IFolderRepository folderRepository, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task HandleAsync(DeleteFolderCommand command, CancellationToken cancellationToken)
    {
        var folder = await _folderRepository.GetByIdAsync(command.FolderId, cancellationToken) ?? throw new DomainRuleViolationException("La carpeta no existe.");
        var childCount = await _folderRepository.CountChildrenAsync(command.FolderId, cancellationToken);
        if (childCount > 0)
        {
            throw new DomainRuleViolationException("No se puede eliminar una carpeta que contiene subcarpetas.");
        }

        await _folderRepository.RemoveAsync(folder, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
