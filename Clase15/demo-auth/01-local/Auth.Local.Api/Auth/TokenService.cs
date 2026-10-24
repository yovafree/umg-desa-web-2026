using System.Security.Claims;
using System.Text;
using Auth.Local.Api.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Auth.Local.Api.Auth;

/// <summary>
/// Emite los JWT de la aplicación usando JsonWebTokenHandler (el handler moderno,
/// más rápido que el antiguo JwtSecurityTokenHandler).
/// </summary>
public class TokenService(IOptions<JwtOptions> options)
{
    private readonly JwtOptions _jwt = options.Value;

    public string CreateAccessToken(User user) =>
        CreateToken(user, TimeSpan.FromMinutes(_jwt.AccessTokenMinutes));

    private string CreateToken(User user, TimeSpan lifetime, IDictionary<string, object>? extraClaims = null)
    {
        // HS256 = HMAC con SHA-256: la MISMA llave firma y verifica.
        // Por eso la llave nunca debe salir del servidor.
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key)),
            SecurityAlgorithms.HmacSha256);

        var claims = new Dictionary<string, object>
        {
            // "sub" (subject): identificador estable del usuario.
            [JwtRegisteredClaimNames.Sub] = user.Id.ToString(),
            [JwtRegisteredClaimNames.Email] = user.Email,
            // "jti": id único del token (útil para listas de revocación).
            [JwtRegisteredClaimNames.Jti] = Guid.NewGuid().ToString(),
        };
        if (extraClaims is not null)
            foreach (var (key, value) in extraClaims)
                claims[key] = value;

        var now = DateTime.UtcNow;
        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = _jwt.Issuer,
            Audience = _jwt.Audience,
            Claims = claims,
            IssuedAt = now,
            NotBefore = now,
            Expires = now.Add(lifetime), // claim "exp"
            SigningCredentials = credentials,
        };

        // El resultado es header.payload.firma en Base64Url.
        // OJO: el payload NO está cifrado, cualquiera puede leerlo. Solo está firmado.
        return new JsonWebTokenHandler().CreateToken(descriptor);
    }
}
