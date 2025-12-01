using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Audit.Queries.SearchAuditLogs;

public sealed class SearchAuditLogsQueryValidator : AbstractValidator<SearchAuditLogsQuery>
{
    public SearchAuditLogsQueryValidator()
    {
        RuleFor(x => x.Take).InclusiveBetween(1, 500);
        RuleFor(x => x.FromUtc).LessThanOrEqualTo(x => x.ToUtc).When(x => x.FromUtc is not null && x.ToUtc is not null);
    }
}