namespace DocManagApi_pruebaIa.Domain.Common.Exceptions;

public sealed class FileSizeTooLargeDomainException : DomainException
{
    public FileSizeTooLargeDomainException(long size) : base("Document.FileSizeTooLarge", $"El tamaño {size} bytes excede el máximo permitido (50MB).") {}
}