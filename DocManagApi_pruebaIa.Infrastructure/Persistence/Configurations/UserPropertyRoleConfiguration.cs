using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class UserPropertyRoleConfiguration : IEntityTypeConfiguration<UserPropertyRole>
{
    public void Configure(EntityTypeBuilder<UserPropertyRole> builder)
    {
        builder.ToTable("user_property_roles");
        builder.HasKey(e => e.Id).HasName("user_property_roles_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.UserId).HasColumnName("user_id");
        builder.Property(e => e.PropertyId).HasColumnName("property_id");
        builder.Property(e => e.RoleId).HasColumnName("role_id");
        builder.Property(e => e.AssignedAt).HasColumnName("assigned_at");

        builder.HasIndex(e => new { e.UserId, e.PropertyId, e.RoleId })
            .IsUnique()
            .HasDatabaseName("uq_user_property_roles");

        builder.HasOne<Role>()
            .WithMany()
            .HasForeignKey(e => e.RoleId)
            .HasConstraintName("fk_upr_role");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .HasConstraintName("fk_upr_user");

        builder.HasOne<Property>()
            .WithMany()
            .HasForeignKey(e => e.PropertyId)
            .HasConstraintName("fk_upr_property");
    }
}