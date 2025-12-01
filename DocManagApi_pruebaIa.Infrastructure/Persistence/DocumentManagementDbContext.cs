using Microsoft.EntityFrameworkCore;
using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence;

public sealed class DocumentManagementDbContext : DbContext
{
    public DocumentManagementDbContext(DbContextOptions<DocumentManagementDbContext> options) : base(options) {}

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<PermissionType> PermissionTypes => Set<PermissionType>();
    public DbSet<ActionType> ActionTypes => Set<ActionType>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserPropertyRole> UserPropertyRoles => Set<UserPropertyRole>();
    public DbSet<Folder> Folders => Set<Folder>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<FolderPermission> FolderPermissions => Set<FolderPermission>();
    public DbSet<AuditLogEntry> AuditLogs => Set<AuditLogEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DocumentManagementDbContext).Assembly);
    }
}