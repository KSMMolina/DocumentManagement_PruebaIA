using DocumentManagementPruebaIA.Domain.Abstractions;
using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.Entities;

public sealed class FolderPermission : Entity
{
    public FolderPermission(Guid id, UserRole role, PermissionScope scope, Guid folderId) : base(id)
    {
        if (role == UserRole.Administrator && scope != PermissionScope.FullAccess)
        {
            throw new DomainRuleViolationException("El rol administrador siempre debe conservar acceso total.");
        }

        Role = role;
        Scope = scope;
        FolderId = folderId;
    }

    public UserRole Role { get; private set; }

    public PermissionScope Scope { get; private set; }

    public Guid FolderId { get; }

    public void UpdateScope(PermissionScope scope)
    {
        if (Role == UserRole.Administrator)
        {
            return;
        }

        Scope = scope;
    }
}
