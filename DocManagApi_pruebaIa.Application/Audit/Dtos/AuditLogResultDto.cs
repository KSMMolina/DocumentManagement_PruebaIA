namespace DocManagApi_pruebaIa.Application.Audit.Dtos
{
    public sealed class AuditLogResultDto
    {
        public Guid Id { get; init; }
        public DateTime OccurredAt { get; init; }
        public Guid UserId { get; init; }
        public Guid? RoleId { get; init; }
        public Guid? PropertyId { get; init; }
        public Guid ActionTypeId { get; init; }
        public Guid? FolderId { get; init; }
        public Guid? DocumentId { get; init; }
        public string Detail { get; init; } = string.Empty;
    }
}
