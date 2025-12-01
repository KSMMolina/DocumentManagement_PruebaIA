namespace DocManagApi_pruebaIa.Domain.Common.Exceptions;

public sealed class CannotRevokeAdminPermissionDomainException : DomainException
{
    public CannotRevokeAdminPermissionDomainException() : base("Permissions.CannotRevokeAdmin", "No se puede revocar permisos del rol ADMINISTRADOR.") {}
}