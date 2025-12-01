using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class FolderRolePermissionConfiguration : IEntityTypeConfiguration<FolderPermission>
{
    public void Configure(EntityTypeBuilder<FolderPermission> builder)
    {
        builder.ToTable("folder_role_permissions");
        builder.HasKey(e => e.Id).HasName("folder_role_permissions_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.FolderId).HasColumnName("folder_id");
        builder.Property(e => e.RoleId).HasColumnName("role_id");
        builder.Property(e => e.PermissionTypeId).HasColumnName("permission_type_id");
        builder.Property(e => e.GrantedAt).HasColumnName("granted_at");

        builder.HasIndex(e => new { e.FolderId, e.RoleId, e.PermissionTypeId })
            .IsUnique()
            .HasDatabaseName("uq_folder_role_permissions");

        builder.HasOne<Folder>()
            .WithMany()
            .HasForeignKey(e => e.FolderId)
            .HasConstraintName("fk_frp_folder")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Role>()
            .WithMany()
            .HasForeignKey(e => e.RoleId)
            .HasConstraintName("fk_frp_role");

        builder.HasOne<PermissionType>()
            .WithMany()
            .HasForeignKey(e => e.PermissionTypeId)
            .HasConstraintName("fk_frp_permission");
    }
}