namespace DocManagApi_pruebaIa.Infrastructure.Settings;

public sealed class InfrastructureSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public bool UseSensitiveDataLogging { get; set; } = false;
}