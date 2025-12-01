using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IPermissionTypeRepository
{
    Task<bool> ExistsAsync(Guid permissionTypeId, CancellationToken ct);
    //To do: Revisar el retorno de este metodo
    Task<(Guid permId, string permCode)?> GetPermissionCodeAsync(Guid permissionTypeId, CancellationToken ct);
}