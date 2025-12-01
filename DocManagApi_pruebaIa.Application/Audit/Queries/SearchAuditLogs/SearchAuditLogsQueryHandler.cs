using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Application.Audit.Dtos;
using MediatR;

namespace DocManagApi_pruebaIa.Application.Audit.Queries.SearchAuditLogs;

public sealed class SearchAuditLogsQueryHandler : IRequestHandler<SearchAuditLogsQuery, IReadOnlyCollection<AuditLogResultDto>>
{
    private readonly IAuditLogRepository _auditRepo;

    public SearchAuditLogsQueryHandler(IAuditLogRepository auditRepo)
    {
        _auditRepo = auditRepo;
    }

    public async Task<IReadOnlyCollection<AuditLogResultDto>> Handle(SearchAuditLogsQuery request, CancellationToken ct)
    {
        var logs = await _auditRepo.SearchAsync(
            request.UserId,
            request.RoleId,
            request.PropertyId,
            request.FolderId,
            request.DocumentId,
            request.ActionTypeId,
            request.FromUtc,
            request.ToUtc,
            request.Take,
            ct);

        return logs.Select(l => new AuditLogResultDto
        {
            Id = l.Id,
            OccurredAt = l.OccurredAt,
            UserId = l.UserId,
            RoleId = l.RoleId,
            PropertyId = l.PropertyId,
            ActionTypeId = l.ActionTypeId,
            FolderId = l.FolderId,
            DocumentId = l.DocumentId,
            Detail = l.Detail
        }).ToList();
    }
}