using DocManagApi_pruebaIa.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class PermissionTypeConfiguration : IEntityTypeConfiguration<PermissionType>
{
    public void Configure(EntityTypeBuilder<PermissionType> builder)
    {
        builder.ToTable("permission_types");
        builder.HasKey(e => e.Id).HasName("permission_types_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.Code)
            .IsRequired()
            .HasColumnName("code");

        builder.Property(e => e.Name)
            .IsRequired()
            .HasColumnName("name");

        builder.HasIndex(e => e.Code)
            .IsUnique()
            .HasDatabaseName("uq_permission_types_code");
    }
}