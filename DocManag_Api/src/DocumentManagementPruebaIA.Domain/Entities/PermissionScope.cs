namespace DocumentManagementPruebaIA.Domain.Entities;

[Flags]
public enum PermissionScope
{
    None = 0,
    View = 1,
    Download = 2,
    FullAccess = View | Download
}
