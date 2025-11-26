using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.ValueObjects;

public sealed record FolderName
{
    public const int MaxLength = 150;

    private FolderName(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static FolderName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainRuleViolationException("El nombre de la carpeta es obligatorio.");
        }

        if (value.Length > MaxLength)
        {
            throw new DomainRuleViolationException($"El nombre de la carpeta supera los {MaxLength} caracteres permitidos.");
        }

        return new FolderName(value.Trim());
    }

    public override string ToString() => Value;
}
