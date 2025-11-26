using DocumentManagementPruebaIA.Domain.Entities;
using DocumentManagementPruebaIA.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Configurations;

public sealed class FolderConfiguration : IEntityTypeConfiguration<Folder>
{
    public void Configure(EntityTypeBuilder<Folder> builder)
    {
        builder.ToTable("folders");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.PropertyId).IsRequired();

        builder.Property(x => x.ParentFolderId);

        builder.Property(x => x.Name)
            .HasConversion(name => name.Value, value => FolderName.Create(value))
            .HasMaxLength(FolderName.MaxLength)
            .IsRequired();

        builder.Property(x => x.Depth)
            .HasConversion(depth => depth.Value, value => FolderDepth.Create(value))
            .IsRequired();

        builder.Property(x => x.SiblingOrder)
            .HasConversion(order => order.Value, value => SiblingOrder.Create(value))
            .IsRequired();

        builder.HasIndex(x => new { x.ParentFolderId, x.SiblingOrder }).IsUnique();
        builder.HasIndex(x => new { x.PropertyId, x.SiblingOrder })
            .HasFilter("\"ParentFolderId\" IS NULL")
            .IsUnique();

        builder.HasCheckConstraint("CK_folders_depth", $"\"Depth\" >= 1 AND \"Depth\" <= {FolderDepth.MaximumDepth}");
        builder.HasCheckConstraint("CK_folders_sibling_order", $"\"SiblingOrder\" >= 1 AND \"SiblingOrder\" <= {SiblingOrder.MaximumSiblings}");

        builder.HasMany<Folder>("Children")
            .WithOne()
            .HasForeignKey(x => x.ParentFolderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Documents)
            .WithOne()
            .HasForeignKey(x => x.FolderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Permissions)
            .WithOne()
            .HasForeignKey(x => x.FolderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(nameof(Folder.Children)).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(nameof(Folder.Documents)).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(nameof(Folder.Permissions)).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
