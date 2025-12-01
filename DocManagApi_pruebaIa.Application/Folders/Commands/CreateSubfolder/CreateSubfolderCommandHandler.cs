using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.ValueObjects;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateSubfolder;

public sealed class CreateSubfolderCommandHandler : IRequestHandler<CreateSubfolderCommand, Result<Guid>>
{
    private readonly IFolderRepository _folderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSubfolderCommandHandler(IFolderRepository folderRepository, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(CreateSubfolderCommand request, CancellationToken ct)
    {
        var parent = await _folderRepository.GetByIdAsync(request.ParentFolderId, ct);
        if (parent is null || parent.IsDeleted)
            return Result<Guid>.Failure(Error.From("Folder.NotFound", "No se encontró la carpeta padre."));

        try
        {
            var name = FolderName.Create(request.Name);
            var child = parent.AddSubfolder(name, request.Description);
            _folderRepository.Update(parent);
            await _unitOfWork.SaveChangesAsync(ct);
            return Result<Guid>.Success(child.Id);
        }
        catch (DomainException ex)
        {
            return Result<Guid>.Failure(DomainExceptionMapper.ToError(ex));
        }
    }
}