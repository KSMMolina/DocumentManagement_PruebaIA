using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateFolder;

public sealed class CreateFolderCommandHandler : IRequestHandler<CreateFolderCommand, Guid>
{
    private readonly IPropertyRepository _propertyRepo;
    private readonly IFolderRepository _folderRepo;
    private readonly IUnitOfWork _uow;

    public CreateFolderCommandHandler(IPropertyRepository propertyRepo, IFolderRepository folderRepo, IUnitOfWork uow)
    {
        _propertyRepo = propertyRepo;
        _folderRepo = folderRepo;
        _uow = uow;
    }

    public async Task<Guid> Handle(CreateFolderCommand request, CancellationToken ct)
    {
        var property = await _propertyRepo.GetByIdAsync(request.PropertyId, ct)
            ?? throw new InvalidOperationException("Property.NotFound");

        var name = FolderName.Create(request.Name);
        var folder = Folder.CreateRoot(property.Id, name, request.Description);

        await _folderRepo.AddAsync(folder, ct);
        await _uow.SaveChangesAsync(ct);

        return folder.Id;
    }
}