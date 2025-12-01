using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Permissions.Commands.AssignFolderPermissions;

public sealed class AssignFolderPermissionsCommandValidator : AbstractValidator<AssignFolderPermissionsCommand>
{
    public AssignFolderPermissionsCommandValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
        RuleFor(x => x.RoleId).NotEmpty();
        RuleFor(x => x.PermissionTypeIds).NotNull().NotEmpty();
        RuleForEach(x => x.PermissionTypeIds).NotEmpty();
    }
}