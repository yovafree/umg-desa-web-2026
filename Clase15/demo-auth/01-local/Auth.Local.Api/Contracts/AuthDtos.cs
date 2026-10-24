namespace Auth.Local.Api.Contracts;

// DTOs (Data Transfer Objects): lo que entra y sale por HTTP.
// Nunca exponemos la entidad User directamente (tiene PasswordHash y TotpSecret).

public record RegisterRequest(string Email, string Password);
