using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.DeleteFolder;

public sealed class DeleteFolderCommandHandler : IRequestHandler<DeleteFolderCommand, Unit>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public DeleteFolderCommandHandler(IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Unit> Handle(DeleteFolderCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        folder.Delete();
        _folderRepo.Update(folder);
        await _uow.SaveChangesAsync(ct);

        return Unit.Value;
    }
}