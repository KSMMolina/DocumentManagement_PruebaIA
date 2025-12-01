namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class FileSlot : IEquatable<FileSlot>
{
    public int Value { get; }
    private FileSlot(int value) => Value = value;

    public static FileSlot Create(int value)
    {
        if (value < 1 || value > 5)
            throw new ArgumentException("FileSlot debe estar entre 1 y 5.");
        return new FileSlot(value);
    }

    public bool Equals(FileSlot? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is FileSlot fs && Equals(fs);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value.ToString();
}