using FluentValidation;

namespace DocManagApi_pruebaIa.Application.Documents.Commands.DeleteDocument;

public sealed class DeleteDocumentCommandValidator : AbstractValidator<DeleteDocumentCommand>
{
    public DeleteDocumentCommandValidator()
    {
        RuleFor(x => x.FolderId).NotEmpty();
        RuleFor(x => x.DocumentId).NotEmpty();
    }
}