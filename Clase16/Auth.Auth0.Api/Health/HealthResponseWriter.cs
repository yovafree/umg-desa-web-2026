using System.Text.Encodings.Web;
using System.Text.Json;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Auth.Auth0.Api.Health;

// Respuesta JSON legible para /health/live y /health/ready.
// Incluye la versión (commit SHA) para que el pipeline de CD compruebe
// que Render está sirviendo EXACTAMENTE la imagen que acaba de publicar.
public static class HealthResponseWriter
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping, // acentos legibles
    };

    public static Task WriteAsync(HttpContext context, HealthReport report)
    {
        var configuration = context.RequestServices.GetRequiredService<IConfiguration>();

        var body = new
        {
            status = report.Status.ToString(),
            version = configuration["APP_VERSION"] ?? "local",
            environment = context.RequestServices.GetRequiredService<IHostEnvironment>().EnvironmentName,
            time = DateTime.UtcNow,
            durationMs = report.TotalDuration.TotalMilliseconds,
            checks = report.Entries.ToDictionary(
                e => e.Key,
                e => new
                {
                    status = e.Value.Status.ToString(),
                    description = e.Value.Description,
                    durationMs = e.Value.Duration.TotalMilliseconds,
                }),
        };

        context.Response.ContentType = "application/json; charset=utf-8";
        return context.Response.WriteAsync(JsonSerializer.Serialize(body, JsonOptions));
    }
}
