using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Permissions.Commands.RevokeFolderPermissions;

public sealed class RevokeFolderPermissionsCommandValidator : AbstractValidator<RevokeFolderPermissionsCommand>
{
    public RevokeFolderPermissionsCommandValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
        RuleFor(x => x.RoleId).NotEmpty();
        RuleFor(x => x.PermissionTypeIds).NotNull().NotEmpty();
        RuleForEach(x => x.PermissionTypeIds).NotEmpty();
    }
}