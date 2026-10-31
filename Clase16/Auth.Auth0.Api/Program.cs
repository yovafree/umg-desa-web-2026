using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using Auth.Auth0.Api.Health;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------
// Puerto: Render (y la mayoría de PaaS) indica en la variable PORT
// dónde debe escuchar el contenedor. En local seguimos usando 5080.
// ---------------------------------------------------------------
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

// ---------------------------------------------------------------
// Logs: en Development, texto legible; en la nube, JSON en una línea
// por evento (stdout). Render captura stdout y lo muestra en "Logs",
// y el JSON se puede filtrar o enviar a un servicio externo.
// ---------------------------------------------------------------
if (!builder.Environment.IsDevelopment())
{
    builder.Logging.ClearProviders();
    builder.Logging.AddJsonConsole(options =>
    {
        options.IncludeScopes = false;
        options.TimestampFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
        options.UseUtcTimestamp = true;
        // Acentos legibles en los logs ("Versión" en lugar de "Versión").
        options.JsonWriterOptions = new JsonWriterOptions { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };
    });
}

// ---------------------------------------------------------------
// Configuración de Auth0
// Local -> dotnet user-secrets set "Auth0:Domain" "tu-tenant.us.auth0.com"
// Nube  -> variables de entorno Auth0__Domain y Auth0__Audience
//          ("__" equivale a ":" en la configuración de .NET)
// ---------------------------------------------------------------
var auth0Domain = builder.Configuration["Auth0:Domain"]?
    .Replace("https://", "").TrimEnd('/');
var auth0Audience = builder.Configuration["Auth0:Audience"];

if (string.IsNullOrWhiteSpace(auth0Domain) || string.IsNullOrWhiteSpace(auth0Audience))
{
    // Fallar temprano con un mensaje claro es mejor que un 401 misterioso.
    throw new InvalidOperationException(
        "Falta configurar Auth0. Local: dotnet user-secrets set \"Auth0:Domain\" \"tu-tenant.us.auth0.com\". " +
        "Contenedor: variable de entorno Auth0__Domain.");
}

// ---------------------------------------------------------------
// Servicios
// ---------------------------------------------------------------
builder.Services.AddOpenApi();

// CORS: solo nuestro frontend puede llamar a la API desde el navegador.
// Local:  http://localhost:5173 (appsettings.json).
// Render: Cors__AllowedOrigins__0=https://auth0-web-xxxx.onrender.com
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy => policy
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()   // necesitamos "Authorization"
        .AllowAnyMethod());
});

// Autenticación con JWT Bearer emitidos por Auth0.
//
// ¿Por qué aquí NO hay llave secreta (a diferencia de la Parte A)?
// Auth0 firma los access tokens con RS256 (criptografía ASIMÉTRICA):
//   - Auth0 guarda la llave PRIVADA y es el único que puede firmar.
//   - Publica las llaves PÚBLICAS en https://{domain}/.well-known/jwks.json (JWKS).
// Con Authority, la API descarga https://{domain}/.well-known/openid-configuration,
// de ahí obtiene la URL del JWKS y cachea las llaves públicas para verificar firmas.
// Una llave pública solo sirve para VERIFICAR, no para firmar: no es un secreto.
// Si Auth0 rota sus llaves, la API las vuelve a descargar automáticamente.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Issuer esperado (claim "iss") y origen del JWKS.
        options.Authority = $"https://{auth0Domain}/";

        // Audience esperada (claim "aud"): el token debe haber sido pedido PARA esta API.
        options.Audience = auth0Audience;

        // Conservamos los nombres originales de los claims ("sub", "permissions").
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "sub",
        };
    });

// Política basada en PERMISOS (RBAC de Auth0).
// Con "Enable RBAC" + "Add Permissions in the Access Token" activos en la API de Auth0,
// el access token trae:  "permissions": ["read:messages"].
// Un usuario autenticado SIN ese permiso recibe 403 (autenticado, pero no autorizado).
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("read:messages", policy => policy
        .RequireAuthenticatedUser()
        .RequireClaim("permissions", "read:messages"));

// Health checks:
//   - "live":  el proceso responde (no revisa dependencias).
//   - "ready": además puede llegar a Auth0. Render usa esta ruta para decidir
//              si la nueva versión recibe tráfico (zero-downtime deploy).
builder.Services.AddHttpClient();
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy("La API está en ejecución"), tags: ["live"])
    .AddCheck<Auth0HealthCheck>("auth0", tags: ["ready"]);

// Un log por petición: método, ruta, status y duración.
builder.Services.AddHttpLogging(options =>
{
    options.LoggingFields = HttpLoggingFields.RequestMethod
        | HttpLoggingFields.RequestPath
        | HttpLoggingFields.ResponseStatusCode
        | HttpLoggingFields.Duration;
    options.CombineLogs = true;
});

// Errores no controlados -> 500 con ProblemDetails (el stack trace va a los logs, no a la respuesta).
builder.Services.AddProblemDetails();

var app = builder.Build();

app.Logger.LogInformation(
    "Auth.Auth0.Api iniciada. Versión {Version}, entorno {Environment}, CORS {Origins}",
    app.Configuration["APP_VERSION"] ?? "local",
    app.Environment.EnvironmentName,
    string.Join(", ", allowedOrigins));

// ---------------------------------------------------------------
// Pipeline HTTP
// ---------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// HttpLogging va primero (más externo) para registrar el status FINAL, incluido el 500.
app.UseHttpLogging();
app.UseExceptionHandler();
app.UseCors("web");
app.UseAuthentication();
app.UseAuthorization();

// ---------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));

// Liveness: solo los checks con tag "live" (no depende de Auth0).
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("live"),
    ResponseWriter = HealthResponseWriter.WriteAsync,
});

// Readiness: todos los checks. Unhealthy -> 503 y Render no enruta tráfico a esa instancia.
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    ResponseWriter = HealthResponseWriter.WriteAsync,
});

// Para la demo de logs: provoca un 500 y observa el stack trace en Render > Logs.
app.MapGet("/api/demo/error", () =>
{
    throw new InvalidOperationException("Error de demostración para observar los logs en Render.");
});

// Anónimo: cualquiera puede llamarlo -> 200
app.MapGet("/api/public", () => Results.Ok(new
{
    message = "Endpoint público: no necesitas token para ver esto.",
}));

// Requiere un access token válido de Auth0 -> 200 / 401
app.MapGet("/api/private", (ClaimsPrincipal user, ILogger<Program> logger) =>
{
    // Log estructurado: {Sub} queda como campo propio en el JSON, no solo dentro del texto.
    logger.LogInformation("Acceso a /api/private por {Sub}", user.FindFirstValue("sub"));
    return Results.Ok(new
    {
        message = "Endpoint privado: tu token de Auth0 es válido.",
        sub = user.FindFirstValue("sub"),
        permissions = GetPermissions(user),
    });
})
.RequireAuthorization();

// Requiere token válido Y el permiso read:messages -> 200 / 401 / 403
app.MapGet("/api/private-scoped", (ClaimsPrincipal user) => Results.Ok(new
{
    message = "Endpoint con permiso: tienes 'read:messages'.",
    sub = user.FindFirstValue("sub"),
    permissions = GetPermissions(user),
}))
.RequireAuthorization("read:messages");

app.Run();

// El arreglo "permissions" del JWT llega como varios claims con el mismo nombre.
static string[] GetPermissions(ClaimsPrincipal user) =>
    user.FindAll("permissions").Select(c => c.Value).ToArray();

// Necesario para que los tests de integración (WebApplicationFactory<Program>) vean la clase.
public partial class Program;
