namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class FolderName : IEquatable<FolderName>
{
    public string Value { get; }
    private FolderName(string value) => Value = value;

    public static FolderName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("FolderName vacío.");
        value = value.Trim();
        if (value.Length > 150)
            throw new ArgumentException("FolderName demasiado largo (>150).");
        return new FolderName(value);
    }

    public bool Equals(FolderName? other) => other is not null && Value.Equals(other.Value, StringComparison.Ordinal);
    public override bool Equals(object? obj) => obj is FolderName fn && Equals(fn);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;
}