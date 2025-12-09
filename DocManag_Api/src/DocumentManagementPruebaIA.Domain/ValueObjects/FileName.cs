using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.ValueObjects;

public sealed record FileName
{
    public const int MaxLength = 200;

    private FileName(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static FileName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainRuleViolationException("El nombre del archivo es obligatorio.");
        }

        if (value.Length > MaxLength)
        {
            throw new DomainRuleViolationException($"El nombre del archivo supera los {MaxLength} caracteres permitidos.");
        }

        return new FileName(value.Trim());
    }

    public override string ToString() => Value;
}
