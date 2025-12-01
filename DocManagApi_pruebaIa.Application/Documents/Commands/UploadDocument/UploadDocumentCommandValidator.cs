using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.UploadDocument;

public sealed class UploadDocumentCommandValidator : AbstractValidator<UploadDocumentCommand>
{
    public UploadDocumentCommandValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.SizeBytes).GreaterThan(0);
        RuleFor(x => x.Description).MaximumLength(500).When(x => x.Description is not null);
    }
}