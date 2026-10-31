using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Auth.Auth0.Api.Health;

// Readiness: la API solo está "lista" si puede llegar al documento OIDC de Auth0.
// Sin él no puede descargar el JWKS y TODOS los endpoints privados responderían 401.
public sealed class Auth0HealthCheck(IHttpClientFactory httpClientFactory, IConfiguration configuration) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var domain = configuration["Auth0:Domain"]?.Replace("https://", "").TrimEnd('/');
        var url = $"https://{domain}/.well-known/openid-configuration";

        try
        {
            var client = httpClientFactory.CreateClient(nameof(Auth0HealthCheck));
            client.Timeout = TimeSpan.FromSeconds(5);

            using var response = await client.GetAsync(url, cancellationToken);
            return response.IsSuccessStatusCode
                ? HealthCheckResult.Healthy($"Auth0 OIDC accesible ({domain})")
                : HealthCheckResult.Unhealthy($"Auth0 respondió {(int)response.StatusCode} en {url}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy($"No se pudo contactar a Auth0 ({domain})", ex);
        }
    }
}
