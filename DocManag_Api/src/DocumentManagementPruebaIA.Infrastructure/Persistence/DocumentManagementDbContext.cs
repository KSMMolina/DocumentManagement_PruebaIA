using DocumentManagementPruebaIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence;

public sealed class DocumentManagementDbContext : DbContext
{
    public DocumentManagementDbContext(DbContextOptions<DocumentManagementDbContext> options) : base(options)
    {
    }

    public DbSet<Property> Properties => Set<Property>();

    public DbSet<Folder> Folders => Set<Folder>();

    public DbSet<DocumentFile> Documents => Set<DocumentFile>();

    public DbSet<FolderPermission> FolderPermissions => Set<FolderPermission>();

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DocumentManagementDbContext).Assembly);
    }
}
