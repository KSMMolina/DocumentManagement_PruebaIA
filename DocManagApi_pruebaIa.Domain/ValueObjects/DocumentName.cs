namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class DocumentName : IEquatable<DocumentName>
{
    public string Value { get; }
    private DocumentName(string value) => Value = value;

    public static DocumentName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("DocumentName vacío.");
        value = value.Trim();
        if (value.Length > 200)
            throw new ArgumentException("DocumentName demasiado largo (>200).");
        return new DocumentName(value);
    }

    public bool Equals(DocumentName? other) => other is not null && Value.Equals(other.Value, StringComparison.Ordinal);
    public override bool Equals(object? obj) => obj is DocumentName dn && Equals(dn);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;
}