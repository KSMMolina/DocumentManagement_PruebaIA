using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Documents.Queries.GetDocumentsByFolder;

public sealed class GetDocumentsByFolderQueryValidator : AbstractValidator<GetDocumentsByFolderQuery>
{
    public GetDocumentsByFolderQueryValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
        RuleFor(x => x.NameLike).MaximumLength(200).When(x => !string.IsNullOrEmpty(x.NameLike));
    }
}