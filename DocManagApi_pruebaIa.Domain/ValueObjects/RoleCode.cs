namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class RoleCode : IEquatable<RoleCode>
{
    public string Value { get; }
    private RoleCode(string value) => Value = value;

    public static RoleCode Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("RoleCode vacío.");
        value = value.Trim().ToUpperInvariant();
        // Lista mínima conocida
        if (value is not ("ADMINISTRADOR" or "RESIDENTE" or "PORTERO"))
            throw new ArgumentException($"RoleCode desconocido '{value}'.");
        return new RoleCode(value);
    }

    public bool Equals(RoleCode? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is RoleCode rc && Equals(rc);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;
}