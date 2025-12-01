using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Permissions.Queries.GetFolderPermissions;

public sealed class GetFolderPermissionsQueryValidator : AbstractValidator<GetFolderPermissionsQuery>
{
    public GetFolderPermissionsQueryValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
    }
}