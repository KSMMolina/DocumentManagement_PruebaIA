using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.ValueObjects;

public sealed record FileDescription
{
    public const int MaxLength = 500;

    private FileDescription(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static FileDescription From(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return new FileDescription(string.Empty);
        }

        if (value.Length > MaxLength)
        {
            throw new DomainRuleViolationException($"La descripción supera los {MaxLength} caracteres permitidos.");
        }

        return new FileDescription(value.Trim());
    }

    public override string ToString() => Value;
}
