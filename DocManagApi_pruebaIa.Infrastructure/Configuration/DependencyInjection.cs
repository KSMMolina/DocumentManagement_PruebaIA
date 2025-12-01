using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Infrastructure.Persistence;
using DocManagApi_pruebaIa.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DocManagApi_pruebaIa.Infrastructure.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddDocumentManagementInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<DocumentManagementDbContext>(opts =>
        {
            opts.UseNpgsql(connectionString);
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IFolderRepository, FolderRepository>();
        services.AddScoped<IDocumentRepository, DocumentRepository>();
        services.AddScoped<IFolderPermissionRepository, FolderPermissionRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        return services;
    }
}