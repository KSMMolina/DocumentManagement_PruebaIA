using DocumentManagementPruebaIA.Domain.Entities;
using DocumentManagementPruebaIA.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Configurations;

public sealed class DocumentFileConfiguration : IEntityTypeConfiguration<DocumentFile>
{
    public void Configure(EntityTypeBuilder<DocumentFile> builder)
    {
        builder.ToTable("documents");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FolderId).IsRequired();

        builder.Property(x => x.Name)
            .HasConversion(name => name.Value, value => FileName.Create(value))
            .HasMaxLength(FileName.MaxLength)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasConversion(desc => desc.Value, value => FileDescription.From(value))
            .HasMaxLength(FileDescription.MaxLength);

        builder.Property(x => x.Size)
            .HasConversion(size => size.Value, value => FileSize.FromBytes(value))
            .IsRequired();

        builder.Property(x => x.Slot)
            .HasConversion(slot => slot.Value, value => DocumentSlot.Create(value))
            .IsRequired();

        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.UpdatedAt).IsRequired();

        builder.HasIndex(x => new { x.FolderId, x.Slot }).IsUnique();
        builder.HasCheckConstraint("CK_documents_slot", $"\"Slot\" >= 1 AND \"Slot\" <= {DocumentSlot.MaxDocumentsPerFolder}");
        builder.HasCheckConstraint("CK_documents_size", $"\"Size\" > 0 AND \"Size\" <= {FileSize.MaximumBytes}");
    }
}
