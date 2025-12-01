using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateSubfolder;

public sealed class CreateSubfolderCommandValidator : AbstractValidator<CreateSubfolderCommand>
{
    public CreateSubfolderCommandValidator()
    {
        RuleFor(x => x.ParentFolderId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).MaximumLength(500).When(x => x.Description is not null);
    }
}