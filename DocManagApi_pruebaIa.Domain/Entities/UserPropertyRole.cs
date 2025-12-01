using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class UserPropertyRole : IEntity
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid PropertyId { get; private set; }
    public Guid RoleId { get; private set; }
    public DateTime AssignedAt { get; private set; }

    private UserPropertyRole() { }

    private UserPropertyRole(Guid id, Guid userId, Guid propertyId, Guid roleId, DateTime assignedAt)
    {
        Id = id;
        UserId = userId;
        PropertyId = propertyId;
        RoleId = roleId;
        AssignedAt = assignedAt;
    }

    public static UserPropertyRole Assign(Guid userId, Guid propertyId, Guid roleId)
        => new(Guid.NewGuid(), userId, propertyId, roleId, DateTime.UtcNow);
}