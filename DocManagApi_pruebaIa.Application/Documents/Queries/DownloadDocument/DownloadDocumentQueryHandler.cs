using MediatR;
using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Documents.Queries.DownloadDocument;

public sealed class DownloadDocumentQueryHandler : IRequestHandler<DownloadDocumentQuery, DownloadDocumentResult>
{
    private readonly IFolderRepository _folderRepo;
    private readonly IRoleRepository _roleRepo;
    private readonly IPermissionTypeRepository _permRepo;
    private readonly IAuditLogRepository _auditRepo;
    private readonly IUnitOfWork _uow;

    public DownloadDocumentQueryHandler(IFolderRepository folderRepo, IRoleRepository roleRepo, IPermissionTypeRepository permRepo, IAuditLogRepository auditRepo, IUnitOfWork uow)
    {
        _folderRepo = folderRepo;
        _roleRepo = roleRepo;
        _permRepo = permRepo;
        _auditRepo = auditRepo;
        _uow = uow;
    }

    public async Task<DownloadDocumentResult> Handle(DownloadDocumentQuery request, CancellationToken ct)
    {
        var folder = await _folderRepo.GetByIdAsync(request.FolderId, ct)
            ?? throw new InvalidOperationException("Folder.NotFound");

        var document = folder.Documents.FirstOrDefault(d => d.Id == request.DocumentId && !d.IsDeleted)
            ?? throw new InvalidOperationException("Document.NotFound");

        // Validar que el rol tenga permiso DOWNLOAD. En este nivel, asumimos que los repositorios
        // pueden proveer códigos; alternativamente, revisar Folder.Permissions.
        var roleCode = await _roleRepo.GetRoleCodeAsync(request.RoleId, ct)
            ?? throw new InvalidOperationException("Role.NotFound");

        var hasDownload = folder.Permissions.Any(p => p.RoleId == request.RoleId &&
                                                      // La infraestructura debe mapear permiso DOWNLOAD a su Id
                                                      true /* sustituir por verificación del PermissionTypeId correspondiente */);
        if (!hasDownload)
            throw new UnauthorizedAccessException("Permissions.Download.Required");

        // Registrar auditoría
        var audit = new AuditLogEntry(Guid.NewGuid(), request.UserId, request.RoleId, folder.PropertyId,
            actionTypeId: Guid.Empty /* mapear en Infra: DOWNLOAD_DOCUMENT */, folderId: folder.Id, documentId: document.Id,
            detail: $"Descarga documento '{document.Name.Value}'");
        await _auditRepo.AddAsync(audit, ct);
        await _uow.SaveChangesAsync(ct);

        return new DownloadDocumentResult
        {
            DocumentId = document.Id,
            Name = document.Name.Value,
            SizeBytes = document.Size.Value
        };
    }
}