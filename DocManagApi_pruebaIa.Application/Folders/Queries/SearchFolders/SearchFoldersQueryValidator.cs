using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Folders.Queries.SearchFolders;

public sealed class SearchFoldersQueryValidator : AbstractValidator<SearchFoldersQuery>
{
    public SearchFoldersQueryValidator()
    {
        RuleFor(x => x.PropertyId).NotEmpty();
        RuleFor(x => x.NameLike).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Take).InclusiveBetween(1, 200);
    }
}