using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.DeleteFolder;

public sealed class DeleteFolderCommandValidator : AbstractValidator<DeleteFolderCommand>
{
    public DeleteFolderCommandValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
    }
}