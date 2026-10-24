using System.Net.Mail;
using Auth.Local.Api.Contracts;
using Auth.Local.Api.Data;
using Auth.Local.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Auth.Local.Api.Endpoints;

public static class AuthEndpoints
{
    private const int MinPasswordLength = 8;

    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/register", Register);

        return app;
    }

    // POST /api/auth/register
    private static async Task<IResult> Register(
        RegisterRequest request,
        AppDbContext db,
        IPasswordHasher<User> hasher)
    {
        var email = NormalizeEmail(request.Email);

        // 1) Validación de entrada: nunca confiamos en lo que manda el cliente.
        var errors = new Dictionary<string, string[]>();
        if (email is null || !MailAddress.TryCreate(email, out _))
            errors["email"] = ["El correo no es válido."];
        if (string.IsNullOrEmpty(request.Password) || request.Password.Length < MinPasswordLength)
            errors["password"] = [$"La contraseña debe tener al menos {MinPasswordLength} caracteres."];
        if (errors.Count > 0)
            return Results.ValidationProblem(errors); // 400

        // 2) El correo debe ser único.
        if (await db.Users.AnyAsync(u => u.Email == email))
            return Results.Conflict(new { message = "El correo ya está registrado." }); // 409

        // 3) Guardamos SOLO el hash. PasswordHasher usa PBKDF2 con sal aleatoria
        //    y muchas iteraciones: aunque roben la BD, no pueden revertir el hash
        //    y dos usuarios con la misma contraseña tendrán hashes distintos.
        var user = new User { Email = email!, PasswordHash = "" };
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Results.Created($"/api/users/{user.Id}", new { user.Id, user.Email }); // 201
    }

    // Comparamos correos sin importar mayúsculas ni espacios.
    private static string? NormalizeEmail(string? email) =>
        string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();
}
