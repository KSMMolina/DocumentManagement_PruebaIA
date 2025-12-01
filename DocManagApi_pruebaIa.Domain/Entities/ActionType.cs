using DocManagApi_pruebaIa.Domain.Common.Abstractions;
using DocManagApi_pruebaIa.Domain.ValueObjects;

namespace DocManagApi_pruebaIa.Domain.Entities;

public sealed class ActionType : IEntity
{
    public Guid Id { get; }
    public ActionTypeCode Code { get; private set; }
    public string Name { get; private set; }

    public ActionType(Guid id, ActionTypeCode code, string name)
    {
        Id = id;
        Code = code;
        Name = name;
    }
}