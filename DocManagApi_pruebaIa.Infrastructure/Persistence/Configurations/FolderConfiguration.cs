using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class FolderConfiguration : IEntityTypeConfiguration<Folder>
{
    public void Configure(EntityTypeBuilder<Folder> builder)
    {
        builder.ToTable("folders");
        builder.HasKey(e => e.Id).HasName("folders_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.PropertyId).HasColumnName("property_id");
        builder.Property(e => e.ParentFolderId).HasColumnName("parent_folder_id");

        builder.Property(e => e.Name)
            .HasConversion(v => v.Value, v => FolderName.Create(v))
            .HasColumnName("folder_name");

        builder.Property(e => e.Description).HasColumnName("description");

        builder.Property(e => e.Depth)
            .HasConversion(v => v.Value, v => Depth.Create(v))
            .HasColumnName("depth");

        // ChildSlot como shadow property si no lo expone el dominio todavía:
        builder.Property<short>("child_slot").HasColumnName("child_slot");

        builder.Property<DateTimeOffset>("created_at").HasColumnName("created_at");

        builder.Property(e => e.IsDeleted).HasColumnName("is_deleted");

        // Índices y constraints
        builder.HasIndex("PropertyId", "ParentFolderId", "child_slot")
            .IsUnique()
            .HasDatabaseName("uq_folders_slot");

        builder.HasIndex("PropertyId", "ParentFolderId", "folder_name")
            .IsUnique()
            .HasDatabaseName("uq_folders_name");

        builder.HasIndex("PropertyId").HasDatabaseName("idx_folders_property");
        builder.HasIndex("ParentFolderId").HasDatabaseName("idx_folders_parent");
        builder.HasIndex("folder_name").HasDatabaseName("idx_folders_name");
    }
}