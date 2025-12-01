namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class PermissionTypeCode : IEquatable<PermissionTypeCode>
{
    public string Value { get; }
    private PermissionTypeCode(string value) => Value = value;

    public static PermissionTypeCode Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("PermissionTypeCode vacío.");
        value = value.Trim().ToUpperInvariant();
        if (value is not ("VIEW" or "DOWNLOAD"))
            throw new ArgumentException($"PermissionTypeCode inválido '{value}'.");
        return new PermissionTypeCode(value);
    }

    public bool Equals(PermissionTypeCode? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is PermissionTypeCode pc && Equals(pc);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;
}