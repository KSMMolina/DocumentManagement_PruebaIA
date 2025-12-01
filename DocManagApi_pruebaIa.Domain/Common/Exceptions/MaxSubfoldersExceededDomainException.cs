namespace DocManagApi_pruebaIa.Domain.Common.Exceptions;

public sealed class MaxSubfoldersExceededDomainException : DomainException
{
    public MaxSubfoldersExceededDomainException() : base("Folder.MaxSubfoldersExceeded", "Se intentó crear más de 2 subcarpetas.") {}
}