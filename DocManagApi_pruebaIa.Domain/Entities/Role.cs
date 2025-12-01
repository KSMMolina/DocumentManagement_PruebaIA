using DocManagApi_pruebaIa.Domain.Common.Abstractions;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class Role : IEntity
{
    public Guid Id { get; }
    public RoleCode Code { get; private set; }
    public string Name { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public Role(Guid id, RoleCode code, string name)
    {
        Id = id;
        Code = code;
        Name = name;
        CreatedAt = DateTime.UtcNow;
    }
}