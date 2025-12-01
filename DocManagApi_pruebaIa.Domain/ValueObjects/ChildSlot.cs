namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class ChildSlot : IEquatable<ChildSlot>
{
    public int Value { get; }
    private ChildSlot(int value) => Value = value;

    public static ChildSlot Create(int value)
    {
        if (value is < 1 or > 2)
            throw new ArgumentException("ChildSlot debe ser 1 o 2.");
        return new ChildSlot(value);
    }

    public bool Equals(ChildSlot? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is ChildSlot cs && Equals(cs);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value.ToString();
}