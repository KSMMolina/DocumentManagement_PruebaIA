namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class FileDescription : IEquatable<FileDescription>
{
    public string Value { get; }
    private FileDescription(string value) => Value = value;

    public static FileDescription Create(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return new FileDescription(string.Empty);
        value = value.Trim();
        if (value.Length > 500)
            throw new ArgumentException("FileDescription demasiado larga (>500).");
        return new FileDescription(value);
    }

    public bool Equals(FileDescription? other) => other is not null && Value.Equals(other.Value, StringComparison.Ordinal);
    public override bool Equals(object? obj) => obj is FileDescription fd && Equals(fd);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;
}