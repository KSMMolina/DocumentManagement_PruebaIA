using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocManagApi_pruebaIa.Domain.Entities;

namespace DocManagApi_pruebaIa.Infrastructure.Persistence.Configurations;

public sealed class ActionTypeConfiguration : IEntityTypeConfiguration<ActionType>
{
    public void Configure(EntityTypeBuilder<ActionType> builder)
    {
        builder.ToTable("action_types");
        builder.HasKey(e => e.Id).HasName("action_types_pkey");

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .HasColumnName("id");

        builder.Property(e => e.Code)
            .HasConversion(v => v.Value, v => DocManagApi_pruebaIa.Domain.ValueObjects.ActionTypeCode.Create(v))
            .HasColumnName("code");

        builder.Property(e => e.Name)
            .IsRequired()
            .HasColumnName("name");

        builder.HasIndex(e => e.Code)
            .IsUnique()
            .HasDatabaseName("uq_action_types_code");
    }
}