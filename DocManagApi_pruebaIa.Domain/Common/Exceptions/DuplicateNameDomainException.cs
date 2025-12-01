namespace DocManagApi_pruebaIa.Domain.Common.Exceptions;

public sealed class DuplicateNameDomainException : DomainException
{
    public DuplicateNameDomainException(string entity, string name) : base($"{entity}.DuplicateName", $"Nombre duplicado '{name}' en {entity}.") {}
}