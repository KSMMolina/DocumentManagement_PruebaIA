# Document Management Prueba IA (Backend)

Arquitectura base en .NET 9 para el módulo de **Gestión documental** aplicando DDD y Arquitectura Limpia. Incluye diseño de dominio, configuración inicial de EF Core para PostgreSQL y script SQL normalizado.

## Estructura de carpetas
```
src/
  DocumentManagementPruebaIA.Domain/        # Entidades, Value Objects, eventos y reglas de negocio
  DocumentManagementPruebaIA.Application/   # Casos de uso, DTOs y puertos
  DocumentManagementPruebaIA.Infrastructure/# DbContext, configuraciones EF Core y adaptadores
  DocumentManagementPruebaIA.Api/           # API mínima (health + Swagger) y composición de dependencias
```

## Pasos rápidos
1. Configura PostgreSQL y crea la base `DocumentManagementIaTest`.
2. Ejecuta el script `database/document_management.sql` (usa `psql -f database/document_management.sql`).
3. Ajusta la cadena de conexión en `src/DocumentManagementPruebaIA.Api/appsettings.json` si es necesario.
4. Restaura y compila la solución (`dotnet restore && dotnet build`) y levanta la API (`dotnet run --project src/DocumentManagementPruebaIA.Api`).

## Diseño del dominio
- **Agregado Property** con carpetas raíz (máximo 2).
- **Folder** controla profundidad máxima (3 niveles) y 2 subcarpetas por padre mediante `SiblingOrder`.
- **DocumentFile** limitado a 5 archivos por carpeta con `DocumentSlot` y `FileSize` (máx. 50 MB).
- **FolderPermission** garantiza que el administrador conserve acceso total.
- **AuditLog** registra todas las operaciones relevantes.

## Persistencia
- `DocumentManagementDbContext` aplica configuraciones fuertes (check constraints, índices únicos filtrados para raíces, límites de tamaño y ranuras).
- Repositorios EF Core (`FolderRepository`, `DocumentRepository`, `AuditLogWriter`) y `UnitOfWork` para consolidar transacciones.

## Uso de casos de uso
Handlers en `Application/UseCases` encapsulan reglas de negocio para crear/editar/eliminar carpetas, almacenar/actualizar archivos, asignar permisos y buscar por filtros. Todos dependen de interfaces para mantener la independencia de infraestructura.

## Prompts utilizados
- Instrucciones de la prueba (sección completa proporcionada por el cliente para modelado, DDD y Arquitectura Limpia).
- Solicitud del usuario actual: estructurar la solución en .NET 9, generar script PostgreSQL normalizado y aplicar buenas prácticas.
