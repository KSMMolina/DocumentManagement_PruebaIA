using DocManagApi_pruebaIa.Domain.Common.Exceptions;

namespace DocManagApi_pruebaIa.Domain.ValueObjects;

public sealed class FileSize : IEquatable<FileSize>
{
    public long Value { get; }
    private FileSize(long value) => Value = value;

    public static FileSize Create(long bytes)
    {
        if (bytes <= 0) throw new ArgumentException("FileSize debe ser positivo.");
        const long max = 50L * 1024L * 1024L;
        if (bytes > max) throw new FileSizeTooLargeDomainException(bytes);
        return new FileSize(bytes);
    }

    public bool Equals(FileSize? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is FileSize fs && Equals(fs);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value.ToString();
}