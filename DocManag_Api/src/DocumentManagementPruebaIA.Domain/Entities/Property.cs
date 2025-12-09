using DocumentManagementPruebaIA.Domain.Abstractions;
using DocumentManagementPruebaIA.Domain.Exceptions;
using DocumentManagementPruebaIA.Domain.ValueObjects;

namespace DocumentManagementPruebaIA.Domain.Entities;

public sealed class Property : AggregateRoot
{
    private readonly List<Folder> _rootFolders = new();

    public Property(Guid id, string code, string name) : base(id)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new DomainRuleViolationException("El código de la propiedad es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainRuleViolationException("El nombre de la propiedad es obligatorio.");
        }

        Code = code.Trim();
        Name = name.Trim();
    }

    public string Code { get; private set; }

    public string Name { get; private set; }

    public IReadOnlyCollection<Folder> RootFolders => _rootFolders;

    public Folder AddRootFolder(Folder folder)
    {
        if (_rootFolders.Count >= SiblingOrder.MaximumSiblings)
        {
            throw new DomainRuleViolationException($"La propiedad ya tiene el máximo de {SiblingOrder.MaximumSiblings} carpetas raíz.");
        }

        if (folder.Depth.Value != 1)
        {
            throw new DomainRuleViolationException("Las carpetas raíz deben estar en profundidad 1.");
        }

        _rootFolders.Add(folder);
        return folder;
    }
}
