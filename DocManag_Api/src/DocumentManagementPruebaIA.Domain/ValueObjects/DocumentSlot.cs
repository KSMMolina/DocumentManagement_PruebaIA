using DocumentManagementPruebaIA.Domain.Exceptions;

namespace DocumentManagementPruebaIA.Domain.ValueObjects;

public sealed record DocumentSlot
{
    public const int MaxDocumentsPerFolder = 5;

    private DocumentSlot(int value)
    {
        Value = value;
    }

    public int Value { get; }

    public static DocumentSlot Create(int value)
    {
        if (value < 1 || value > MaxDocumentsPerFolder)
        {
            throw new DomainRuleViolationException($"Solo se permiten {MaxDocumentsPerFolder} archivos por carpeta.");
        }

        return new DocumentSlot(value);
    }
}
