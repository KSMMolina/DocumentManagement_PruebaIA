using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class Property : IEntity
{
    public Guid Id { get; }
    public string Code { get; private set; }
    public string Name { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Property(Guid id, string code, string name)
    {
        Id = id;
        Code = code;
        Name = name;
        CreatedAt = DateTime.UtcNow;
    }
}