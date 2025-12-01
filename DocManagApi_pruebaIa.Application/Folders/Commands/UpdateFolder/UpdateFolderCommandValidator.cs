using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.UpdateFolder;

public sealed class UpdateFolderCommandValidator : AbstractValidator<UpdateFolderCommand>
{
    public UpdateFolderCommandValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).MaximumLength(500).When(x => x.Description is not null);
    }
}