using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocManagApi_pruebaIa.Domain.Entities;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("documents");
        builder.HasKey(e => e.Id).HasName("documents_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.FolderId).HasColumnName("folder_id");

        builder.Property(e => e.Name)
            .HasConversion(v => v.Value, v => DocumentName.Create(v))
            .HasColumnName("document_name");

        builder.Property(e => e.Description)
            .HasConversion(v => v.Value, v => FileDescription.Create(v))
            .HasColumnName("description");

        builder.Property(e => e.Size)
            .HasConversion(v => v.Value, v => FileSize.Create(v))
            .HasColumnName("file_size_bytes");

        builder.Property(e => e.CreatedAt).HasColumnName("created_at");
        builder.Property(e => e.IsDeleted).HasColumnName("is_deleted");
        builder.Property<short>("file_slot").HasColumnName("file_slot");

        builder.HasIndex("FolderId", "file_slot").IsUnique().HasDatabaseName("uq_documents_slot");
        builder.HasIndex("FolderId", "document_name").IsUnique().HasDatabaseName("uq_documents_name");
        builder.HasIndex("FolderId").HasDatabaseName("idx_documents_folder");
        builder.HasIndex("document_name").HasDatabaseName("idx_documents_name");
    }
}