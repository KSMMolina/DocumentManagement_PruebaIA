using DocumentManagementPruebaIA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocumentManagementPruebaIA.Infrastructure.Persistence.Configurations;

public sealed class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Action).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Actor).HasMaxLength(200).IsRequired();
        builder.Property(x => x.ActorRole).HasMaxLength(100).IsRequired();
        builder.Property(x => x.OccurredOn).IsRequired();
        builder.Property(x => x.Details).HasMaxLength(500);
    }
}
