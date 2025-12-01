namespace DocManagApi_pruebaIa.Domain.Common.Exceptions;

public sealed class MaxDepthExceededDomainException : DomainException
{
    public MaxDepthExceededDomainException() : base("Folder.MaxDepthExceeded", "La profundidad máxima (3) fue excedida.") {}
}