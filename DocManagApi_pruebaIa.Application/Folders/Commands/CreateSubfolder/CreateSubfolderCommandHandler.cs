using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateSubfolder;

public sealed class CreateSubfolderCommandHandler : IRequestHandler<CreateSubfolderCommand, Guid>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public CreateSubfolderCommandHandler(IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Guid> Handle(CreateSubfolderCommand request, CancellationToken ct)
    {
        var parent = await _folderRepo.GetByIdAsync(request.ParentFolderId, ct)
            ?? throw new InvalidOperationException("Folder.Parent.NotFound");

        if (parent.IsDeleted)
            throw new InvalidOperationException("Folder.Parent.Deleted");

        var name = FolderName.Create(request.Name);
        var child = parent.AddSubfolder(name, request.Description);

        _folderRepo.Update(parent);
        await _uow.SaveChangesAsync(ct);

        return child.Id;
    }
}