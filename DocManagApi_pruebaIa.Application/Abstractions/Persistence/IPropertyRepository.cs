using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IPropertyRepository
{
    Task<Property?> GetByIdAsync(Guid propertyId, CancellationToken ct);
}