using DocManagApi_pruebaIa.Application.Abstractions.Persistence;
using DocManagApi_pruebaIa.Infrastructure.Persistence;
using DocManagApi_pruebaIa.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DocManagApi_pruebaIa.Infrastructure.Settings;

public static class DependencyInjection
{
    public static IServiceCollection AddDocumentManagementInfrastructure(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        serviceCollection.AddDbContext<DocumentManagementDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("DocumentManagement")));

        serviceCollection.AddScoped<IUnitOfWork, UnitOfWork>();
        serviceCollection.AddScoped<IFolderRepository, FolderRepository>();
        serviceCollection.AddScoped<IDocumentRepository, DocumentRepository>();
        serviceCollection.AddScoped<IFolderPermissionRepository, FolderPermissionRepository>();
        serviceCollection.AddScoped<IAuditLogRepository, AuditLogRepository>();

        return serviceCollection;
    }
}