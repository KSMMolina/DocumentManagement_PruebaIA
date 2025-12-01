using DocManagApi_pruebaIa.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class AuditLogConfiguration : IEntityTypeConfiguration<AuditLogEntry>
{
    public void Configure(EntityTypeBuilder<AuditLogEntry> builder)
    {
        builder.ToTable("audit_logs");
        builder.HasKey(e => e.Id).HasName("audit_logs_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.OccurredAt).HasColumnName("occurred_at");
        builder.Property(e => e.UserId).HasColumnName("user_id");
        builder.Property(e => e.RoleId).HasColumnName("role_id");
        builder.Property(e => e.PropertyId).HasColumnName("property_id");
        builder.Property(e => e.ActionTypeId).HasColumnName("action_type_id");
        builder.Property(e => e.FolderId).HasColumnName("folder_id");
        builder.Property(e => e.DocumentId).HasColumnName("document_id");
        builder.Property(e => e.Detail).HasColumnName("detail");

        builder.HasIndex(e => e.UserId).HasDatabaseName("idx_audit_user");
        builder.HasIndex(e => e.ActionTypeId).HasDatabaseName("idx_audit_action");
        builder.HasIndex(e => e.FolderId).HasDatabaseName("idx_audit_folder");
        builder.HasIndex(e => e.DocumentId).HasDatabaseName("idx_audit_document");
        builder.HasIndex(e => e.PropertyId).HasDatabaseName("idx_audit_property");

        builder.HasOne<User>().WithMany().HasForeignKey(e => e.UserId).HasConstraintName("fk_audit_user");
        builder.HasOne<Role>().WithMany().HasForeignKey(e => e.RoleId).HasConstraintName("fk_audit_role");
        builder.HasOne<Property>().WithMany().HasForeignKey(e => e.PropertyId).HasConstraintName("fk_audit_property");
        builder.HasOne<ActionType>().WithMany().HasForeignKey(e => e.ActionTypeId).HasConstraintName("fk_audit_action");
        builder.HasOne<Folder>().WithMany().HasForeignKey(e => e.FolderId).HasConstraintName("fk_audit_folder");
        builder.HasOne<Document>().WithMany().HasForeignKey(e => e.DocumentId).HasConstraintName("fk_audit_document");

        // Dominio: coherencia acción vs referencias (ej: DOWNLOAD_DOCUMENT requiere document_id).
    }
}