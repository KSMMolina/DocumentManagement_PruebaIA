using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.ValueObjects;

public sealed record SiblingOrder
{
    public const int MaximumSiblings = 2;

    private SiblingOrder(int value)
    {
        Value = value;
    }

    public int Value { get; }

    public static SiblingOrder Create(int value)
    {
        if (value < 1 || value > MaximumSiblings)
        {
            throw new DomainRuleViolationException($"Solo se permiten {MaximumSiblings} carpetas por nivel.");
        }

        return new SiblingOrder(value);
    }
}
