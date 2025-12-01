namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class ActionTypeCode : IEquatable<ActionTypeCode>
{
    public string Value { get; }
    private ActionTypeCode(string value) => Value = value;

    public static ActionTypeCode Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("ActionTypeCode vacío.");
        value = value.Trim().ToUpperInvariant();
        // Validación simple inicial
        var allowed = new[]
        {
            "CREATE_FOLDER","UPDATE_FOLDER","DELETE_FOLDER",
            "CREATE_DOCUMENT","UPDATE_DOCUMENT","DELETE_DOCUMENT",
            "DOWNLOAD_DOCUMENT","ASSIGN_PERMISSION","REVOKE_PERMISSION"
        };
        if (!allowed.Contains(value))
            throw new ArgumentException($"ActionTypeCode inválido '{value}'.");
        return new ActionTypeCode(value);
    }

    public bool Equals(ActionTypeCode? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is ActionTypeCode ac && Equals(ac);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;
}