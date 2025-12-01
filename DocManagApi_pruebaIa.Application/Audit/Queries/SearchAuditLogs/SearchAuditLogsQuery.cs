using DocManagApi_pruebaIa.Application.Audit.Dtos;
using MediatR;

namespace DocManagApi_pruebaIa.Application.Audit.Queries.SearchAuditLogs;

public sealed record SearchAuditLogsQuery(
    Guid? UserId,
    Guid? RoleId,
    Guid? PropertyId,
    Guid? FolderId,
    Guid? DocumentId,
    Guid? ActionTypeId,
    DateTime? FromUtc,
    DateTime? ToUtc,
    int Take = 100) : IRequest<IReadOnlyCollection<AuditLogResultDto>>;