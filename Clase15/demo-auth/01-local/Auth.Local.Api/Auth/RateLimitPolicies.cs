namespace Auth.Local.Api.Auth;

// Nombres de las políticas de rate limiting (evitamos "strings mágicos" repetidos).
public static class RateLimitPolicies
{
    public const string Login = "login";
}
