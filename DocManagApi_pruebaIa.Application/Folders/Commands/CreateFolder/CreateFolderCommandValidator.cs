using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Folders.Commands.CreateFolder;

public sealed class CreateFolderCommandValidator : AbstractValidator<CreateFolderCommand>
{
    public CreateFolderCommandValidator()
    {
        RuleFor(x => x.PropertyId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).MaximumLength(500).When(x => x.Description is not null);
    }
}