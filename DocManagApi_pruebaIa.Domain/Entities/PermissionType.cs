using DocManagApi_pruebaIa.Domain.Common.Abstractions;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class PermissionType : IEntity
{
    public Guid Id { get; }
    public PermissionTypeCode Code { get; private set; }
    public string Name { get; private set; }

    public PermissionType(Guid id, PermissionTypeCode code, string name)
    {
        Id = id;
        Code = code;
        Name = name;
    }
}