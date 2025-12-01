using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.DeleteFolder;

public sealed class DeleteFolderCommandHandler : IRequestHandler<DeleteFolderCommand, Result<Unit>>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public DeleteFolderCommandHandler(IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Result<Unit>> Handle(DeleteFolderCommand request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct);
        if (folder is null)
            return Result<Unit>.Failure(new Error("Folder.NotFound", "No se encontró la carpeta."));

        try
        {
            folder.Delete();
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