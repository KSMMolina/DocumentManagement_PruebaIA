using DocManagApi_pruebaIa.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles");
        builder.HasKey(e => e.Id).HasName("roles_pkey");

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
            .HasDatabaseName("uq_roles_code");
    }
}