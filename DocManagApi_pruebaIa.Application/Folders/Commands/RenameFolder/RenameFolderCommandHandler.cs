using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Domain.ValueObjects;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.RenameFolder;

public sealed class RenameFolderCommandHandler : IRequestHandler<RenameFolderCommand, Result<Unit>>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public RenameFolderCommandHandler(IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Result<Unit>> Handle(RenameFolderCommand request, CancellationToken ct)
    {
        if (request.FolderId == Guid.Empty)
            return Result<Unit>.Failure(Error.From("Folder.InvalidId", "El identificador de la carpeta es inválido."));
        if (string.IsNullOrWhiteSpace(request.NewName))
            return Result<Unit>.Failure(Error.From("Folder.Name.Required", "El nuevo nombre es requerido."));

        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct);
        if (folder is null || folder.IsDeleted)
            return Result<Unit>.Failure(Error.From("Folder.NotFound", "No se encontró la carpeta."));

        try
        {
            var newNameVo = FolderName.Create(request.NewName);
            folder.Rename(newNameVo);
            _folderRepo.Update(folder);
            await _uow.SaveChangesAsync(ct);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (DomainException ex)
        {
            return Result<Unit>.Failure(DomainExceptionMapper.ToError(ex));
        }
    }
}