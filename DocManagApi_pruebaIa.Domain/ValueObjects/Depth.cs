namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class Depth : IEquatable<Depth>
{
    public int Value { get; }
    private Depth(int value) => Value = value;

    public static Depth Create(int value)
    {
        if (value < 1 || value > 3)
            throw new Common.Exceptions.MaxDepthExceededDomainException();
        return new Depth(value);
    }

    public Depth Increment()
    {
        var next = Value + 1;
        if (next > 3)
            throw new Common.Exceptions.MaxDepthExceededDomainException();
        return new Depth(next);
    }

    public bool Equals(Depth? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is Depth d && Equals(d);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value.ToString();
}