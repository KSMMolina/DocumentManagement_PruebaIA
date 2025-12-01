using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Documents.Queries.DownloadDocument;

public sealed class DownloadDocumentQueryValidator : AbstractValidator<DownloadDocumentQuery>
{
    public DownloadDocumentQueryValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
        RuleFor(x => x.DocumentId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.RoleId).NotEmpty();
    }
}