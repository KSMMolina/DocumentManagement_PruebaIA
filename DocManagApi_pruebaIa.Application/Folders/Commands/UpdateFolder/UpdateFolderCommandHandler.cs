using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.UpdateFolder;

public sealed class UpdateFolderCommandHandler : IRequestHandler<UpdateFolderCommand, Unit>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public UpdateFolderCommandHandler(IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Unit> Handle(UpdateFolderCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        if (folder.IsDeleted)
            throw new InvalidOperationException("Folder.Deleted");

        var newName = FolderName.Create(request.Name);
        folder.Rename(newName);
        // Descripción: se cambia directamente ya que es string simple en dominio
        // Si deseas VO para descripción, ajusta aquí:
        if (request.Description is not null)
            folder.GetType().GetProperty("Description")!.SetValue(folder, request.Description);

        _folderRepo.Update(folder);
        await _uow.SaveChangesAsync(ct);

        return Unit.Value;
    }
}