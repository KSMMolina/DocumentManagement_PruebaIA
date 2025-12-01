using DocManagApi_pruebaIa.Domain.Common.Abstractions;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class User : IEntity
{
    public Guid Id { get; }
    public string Username { get; private set; }
    public string DisplayName { get; private set; }
    public string Email { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    public User(Guid id, string username, string displayName, string email, bool isActive = true)
    {
        Id = id;
        Username = username;
        DisplayName = displayName;
        Email = email;
        IsActive = isActive;
        CreatedAt = DateTime.UtcNow;
    }
}