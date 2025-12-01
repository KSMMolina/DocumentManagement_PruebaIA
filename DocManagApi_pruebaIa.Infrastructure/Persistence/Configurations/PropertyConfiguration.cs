using DocManagApi_pruebaIa.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class PropertyConfiguration : IEntityTypeConfiguration<Property>
{
    public void Configure(EntityTypeBuilder<Property> builder)
    {
        builder.ToTable("properties");
        builder.HasKey(e => e.Id).HasName("properties_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.Code)
            .IsRequired()
            .HasColumnName("code");

        builder.Property(e => e.Name)
            .IsRequired()
            .HasColumnName("name");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at");

        builder.HasIndex(e => e.Code)
            .IsUnique()
            .HasDatabaseName("uq_properties_code");
    }
}