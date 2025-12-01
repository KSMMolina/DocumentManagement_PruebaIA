namespace DocManagApi_pruebaIa.Domain.Common.Exceptions;

public sealed class MaxDocumentsExceededDomainException : DomainException
{
    public MaxDocumentsExceededDomainException() : base("Folder.MaxDocumentsExceeded", "Se intentó agregar más de 5 documentos en la carpeta.") {}
}