var builder = WebApplication.CreateBuilder(args);

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

var app = builder.Build();

// ---------------------------------------------------------------
// Pipeline HTTP
// ---------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("web");

// ---------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));

app.Run();
