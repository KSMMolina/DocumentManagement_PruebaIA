using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Application.Abstractions.Persistence;

public interface IRoleRepository
{
    Task<Role?> GetByIdAsync(Guid roleId, CancellationToken ct);

    //To do: Revisar el retorno de este metodo
    Task<(Guid roleId, string roleCode)?> GetRoleCodeAsync(Guid roleId, CancellationToken ct);
}