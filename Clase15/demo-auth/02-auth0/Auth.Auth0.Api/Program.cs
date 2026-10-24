using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------
// Configuración de Auth0
// Domain   -> dotnet user-secrets set "Auth0:Domain" "tu-tenant.us.auth0.com"
// Audience -> appsettings.json (identifier de la API creada en Auth0)
// ---------------------------------------------------------------
var auth0Domain = builder.Configuration["Auth0:Domain"]?
    .Replace("https://", "").TrimEnd('/');
var auth0Audience = builder.Configuration["Auth0:Audience"];

if (string.IsNullOrWhiteSpace(auth0Domain) || string.IsNullOrWhiteSpace(auth0Audience))
{
    // Fallar temprano con un mensaje claro es mejor que un 401 misterioso.
    throw new InvalidOperationException(
        "Falta configurar Auth0. Ejecuta: dotnet user-secrets set \"Auth0:Domain\" \"tu-tenant.us.auth0.com\"");
}

// ---------------------------------------------------------------
// Servicios
// ---------------------------------------------------------------
builder.Services.AddOpenApi();

// CORS: solo nuestro frontend (React en el puerto 5173) puede llamar a la API desde el navegador.
builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy => policy
        .WithOrigins("http://localhost:5173")
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

builder.Services.AddAuthorization();

var app = builder.Build();

// ---------------------------------------------------------------
// Pipeline HTTP
// ---------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("web");
app.UseAuthentication();
app.UseAuthorization();

// ---------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));

app.Run();
