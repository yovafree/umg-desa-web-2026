using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Auth.Auth0.Api.Tests;

// Fábrica de la API en memoria con una configuración de Auth0 ficticia.
// Estos tests NO llaman a Auth0: solo comprueban el comportamiento que no necesita un token real.
public class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("Auth0:Domain", "demo-ci.us.auth0.com");
        builder.UseSetting("Auth0:Audience", "https://api.demo-auth.local");
        builder.UseSetting("Cors:AllowedOrigins:0", "https://web.ejemplo.com");
    }
}

public class ApiTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task HealthLive_Responde200()
    {
        var response = await _client.GetAsync("/health/live");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"status\": \"Healthy\"", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Public_Responde200SinToken()
    {
        var response = await _client.GetAsync("/api/public");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/private")]
    [InlineData("/api/private-scoped")]
    public async Task Privados_Responden401SinToken(string url)
    {
        var response = await _client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Cors_PermiteElOrigenConfigurado()
    {
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/public");
        request.Headers.Add("Origin", "https://web.ejemplo.com");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        var response = await _client.SendAsync(request);

        Assert.Equal("https://web.ejemplo.com", response.Headers.GetValues("Access-Control-Allow-Origin").Single());
    }

    [Fact]
    public async Task Cors_RechazaOtrosOrigenes()
    {
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/public");
        request.Headers.Add("Origin", "https://sitio-malicioso.com");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        var response = await _client.SendAsync(request);

        Assert.False(response.Headers.Contains("Access-Control-Allow-Origin"));
    }
}
