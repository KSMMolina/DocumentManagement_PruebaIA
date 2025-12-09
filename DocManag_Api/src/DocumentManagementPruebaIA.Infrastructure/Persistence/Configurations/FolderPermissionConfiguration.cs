using DocumentManagementPruebaIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Configurations;

public sealed class FolderPermissionConfiguration : IEntityTypeConfiguration<FolderPermission>
{
    public void Configure(EntityTypeBuilder<FolderPermission> builder)
    {
        builder.ToTable("folder_permissions");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Role).IsRequired();
        builder.Property(x => x.Scope).IsRequired();
        builder.Property(x => x.FolderId).IsRequired();

        builder.HasIndex(x => new { x.FolderId, x.Role }).IsUnique();
        builder.HasCheckConstraint("CK_folder_permissions_admin_scope", "\"Role\" <> 1 OR \"Scope\" = 3");
    }
}
