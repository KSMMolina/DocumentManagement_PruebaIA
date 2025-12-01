using DocManagApi_pruebaIa.Application.Settings;
using DocManagApi_pruebaIa.Infrastructure.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDocumentManagementApplication();
builder.Services.AddDocumentManagementInfrastructure(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
