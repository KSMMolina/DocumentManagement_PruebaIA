using DocManagApi_pruebaIa.Domain.Common.Exceptions;

namespace DocManagApi_pruebaIa.Application.Common.Results;

public static class DomainExceptionMapper
{
    public static Error ToError(DomainException ex) => Error.From(ex.Code, ex.Message);
}