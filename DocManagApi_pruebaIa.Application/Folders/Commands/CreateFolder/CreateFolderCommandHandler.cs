using MediatR;
using DocManagApi_pruebaIa.Application.Common.Results;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Domain.ValueObjects;
using DocManagApi_pruebaIa.Domain.Common.Exceptions;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateFolder;

public sealed class CreateFolderCommandHandler : IRequestHandler<CreateFolderCommand, Result<Guid>>
{
    private readonly IFolderRepository _folderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateFolderCommandHandler(IFolderRepository folderRepository, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(CreateFolderCommand request, CancellationToken ct)
    {
        try
        {
            var name = FolderName.Create(request.Name);
            var folder = Folder.CreateRoot(request.PropertyId, name, request.Description);
            await _folderRepository.AddAsync(folder, ct);
            await _unitOfWork.SaveChangesAsync(ct);
            return Result<Guid>.Success(folder.Id);
        }
        catch (DomainException ex)
        {
            return Result<Guid>.Failure(DomainExceptionMapper.ToError(ex));
        }
    }
}