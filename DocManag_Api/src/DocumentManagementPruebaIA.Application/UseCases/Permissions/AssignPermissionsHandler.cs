using DocumentManagementPruebaIA.Application.Contracts.Requests;
using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Domain.Entities;
using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Application.UseCases.Permissions;

public sealed class AssignPermissionsHandler
{
    private readonly IFolderRepository _folderRepository;
    private readonly IAuditLogWriter _auditLogWriter;
    private readonly IUnitOfWork _unitOfWork;

    public AssignPermissionsHandler(IFolderRepository folderRepository, IAuditLogWriter auditLogWriter, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _auditLogWriter = auditLogWriter;
        _unitOfWork = unitOfWork;
    }

    public async Task HandleAsync(AssignPermissionsCommand command, CancellationToken cancellationToken)
    {
        var folder = await _folderRepository.GetByIdAsync(command.FolderId, cancellationToken) ?? throw new DomainRuleViolationException("La carpeta no existe.");

        foreach (var dto in command.Permissions)
        {
            var scope = PermissionScope.None;
            if (dto.CanView)
            {
                scope |= PermissionScope.View;
            }

            if (dto.CanDownload)
            {
                scope |= PermissionScope.Download;
            }

            folder.AddPermission(new FolderPermission(Guid.NewGuid(), dto.Role, scope, folder.Id));
        }

        await _folderRepository.SaveAsync(folder, cancellationToken);
        await _auditLogWriter.AddAsync(new AuditLog(Guid.NewGuid(), "PERMISSIONS_UPDATED", "system", UserRole.Administrator.ToString(), DateTimeOffset.UtcNow, "Permisos actualizados", folder.Id, null), cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
