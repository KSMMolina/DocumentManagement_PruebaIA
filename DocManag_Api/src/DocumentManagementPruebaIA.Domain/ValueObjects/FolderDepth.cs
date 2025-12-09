using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.ValueObjects;

public sealed record FolderDepth
{
    public const int MaximumDepth = 3;

    private FolderDepth(int value)
    {
        Value = value;
    }

    public int Value { get; }

    public static FolderDepth Create(int value)
    {
        if (value < 1)
        {
            throw new DomainRuleViolationException("La profundidad de la carpeta debe ser mayor o igual a 1.");
        }

        if (value > MaximumDepth)
        {
            throw new DomainRuleViolationException($"La profundidad máxima permitida es {MaximumDepth}.");
        }

        return new FolderDepth(value);
    }
}
