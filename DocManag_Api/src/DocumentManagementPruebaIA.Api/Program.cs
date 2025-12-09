using DocumentManagementPruebaIA.Application.Interfaces;
using DocumentManagementPruebaIA.Application.UseCases.Documents;
using DocumentManagementPruebaIA.Application.UseCases.Folders;
using DocumentManagementPruebaIA.Application.UseCases.Permissions;
using DocumentManagementPruebaIA.Infrastructure.Persistence;
using DocumentManagementPruebaIA.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DocumentManagementDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DocumentManagementDb"));
});

builder.Services.AddScoped<IFolderRepository, FolderRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IAuditLogWriter, AuditLogWriter>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<CreateFolderHandler>();
builder.Services.AddScoped<UpdateFolderHandler>();
builder.Services.AddScoped<DeleteFolderHandler>();
builder.Services.AddScoped<StoreDocumentHandler>();
builder.Services.AddScoped<UpdateDocumentHandler>();
builder.Services.AddScoped<SearchDocumentsHandler>();
builder.Services.AddScoped<AssignPermissionsHandler>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.Run();
