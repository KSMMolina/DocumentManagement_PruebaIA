using DocManagApi_pruebaIa.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(e => e.Id).HasName("users_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.Username)
            .IsRequired()
            .HasColumnName("username");

        builder.Property(e => e.DisplayName)
            .IsRequired()
            .HasColumnName("display_name");

        builder.Property(e => e.Email)
            .IsRequired()
            .HasColumnName("email");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at");

        builder.HasIndex(e => e.Username)
            .IsUnique()
            .HasDatabaseName("uq_users_username");

        builder.HasIndex(e => e.Email)
            .IsUnique()
            .HasDatabaseName("uq_users_email");
    }
}