using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.ValueObjects;

public sealed record FileSize
{
    public const long MaximumBytes = 50 * 1024 * 1024;

    private FileSize(long value)
    {
        Value = value;
    }

    public long Value { get; }

    public static FileSize FromBytes(long value)
    {
        if (value <= 0)
        {
            throw new DomainRuleViolationException("El archivo debe tener un tamaño mayor a cero.");
        }

        if (value > MaximumBytes)
        {
            throw new DomainRuleViolationException("El archivo supera el tamaño máximo permitido de 50 MB.");
        }

        return new FileSize(value);
    }
}
