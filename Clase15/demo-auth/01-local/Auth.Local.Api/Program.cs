using Auth.Local.Api.Auth;
using Auth.Local.Api.Data;
using Auth.Local.Api.Endpoints;
using Auth.Local.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------
// Servicios
// ---------------------------------------------------------------
builder.Services.AddOpenApi();

// EF Core + SQLite: la base de datos es un archivo local (auth.db).
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// PasswordHasher<User> viene de ASP.NET Core Identity (incluido en el framework).
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// Opciones JWT tipadas. ValidateOnStart hace que la API NO arranque si falta
// la llave (Jwt:Key) en user-secrets: mejor fallar temprano que emitir tokens inseguros.
builder.Services.AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection(JwtOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddSingleton<TokenService>();

var app = builder.Build();

// Para la demo usamos EnsureCreated: crea auth.db con el esquema si no existe.
// (En un proyecto real usaríamos migraciones: dotnet ef migrations add ...)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ---------------------------------------------------------------
// Pipeline HTTP
// ---------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ---------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));

app.MapAuthEndpoints();

app.Run();
