using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using LaundryOrdersApi.Data;
using LaundryOrdersApi.Models;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LaundryContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add authentication with JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured.")))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithMethods("OPTIONS", "GET", "POST", "PUT", "DELETE")
            .AllowCredentials()
    );
});

builder.Services.AddAuthorization();

builder.Services.AddControllers();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LaundryContext>();

    context.Database.Migrate();
    context.SaveChanges();
    context.Users.RemoveRange(context.Users);
    if (!context.Users.Any())
    {
        context.Users.RemoveRange(context.Users);
        context.SaveChanges();
        context.Users.AddRange(
            new User
            {
                Username = "admin.name",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin"
            },
            new User
            {
                Username = "user.name",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
                Role = "User"
            }
        );
        context.SaveChanges();
    }
    if (!context.Orders.Any())
    {
        var users = context.Users.ToList();
        var regularUser = users.FirstOrDefault(u => u.Username == "user.name");

        if (regularUser != null)
        {
            context.Orders.AddRange(
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "3 chemises, 2 pantalons, linge de lit", Status = "En attente", Date = DateTime.UtcNow.AddDays(-5), CreatedAt = DateTime.UtcNow.AddDays(-5), UpdatedAt = DateTime.UtcNow.AddDays(-5) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "3 blouses, 2 chemises, 2 pantalons, linge de lit", Status = "Validée", Date = DateTime.UtcNow.AddDays(-4), CreatedAt = DateTime.UtcNow.AddDays(-4), UpdatedAt = DateTime.UtcNow.AddDays(-4) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "2 serviettes, linge de lit", Status = "En attente", Date = DateTime.UtcNow.AddDays(-3), CreatedAt = DateTime.UtcNow.AddDays(-3), UpdatedAt = DateTime.UtcNow.AddDays(-3) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "3 chemises, 2 pantalons, linge de lit", Status = "Refusée", Date = DateTime.UtcNow.AddDays(-2), CreatedAt = DateTime.UtcNow.AddDays(-2), UpdatedAt = DateTime.UtcNow.AddDays(-2) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "3 blouses, 2 chemises, 2 pantalons, linge de lit", Status = "Validée", Date = DateTime.UtcNow.AddDays(-1), CreatedAt = DateTime.UtcNow.AddDays(-1), UpdatedAt = DateTime.UtcNow.AddDays(-1) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "2 serviettes, linge de lit", Status = "En attente", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "3 chemises, 2 pantalons, linge de lit", Status = "En attente", Date = DateTime.UtcNow.AddDays(-6), CreatedAt = DateTime.UtcNow.AddDays(-6), UpdatedAt = DateTime.UtcNow.AddDays(-6) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "3 blouses, 2 chemises, 2 pantalons, linge de lit", Status = "Validée", Date = DateTime.UtcNow.AddDays(-7), CreatedAt = DateTime.UtcNow.AddDays(-7), UpdatedAt = DateTime.UtcNow.AddDays(-7) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "2 serviettes, linge de lit", Status = "Refusée", Date = DateTime.UtcNow.AddDays(-8), CreatedAt = DateTime.UtcNow.AddDays(-8), UpdatedAt = DateTime.UtcNow.AddDays(-8) },
                new Order { UserId = regularUser.Id, Username = regularUser.Username, Articles = "3 chemises, 2 pantalons, linge de lit", Status = "En attente", Date = DateTime.UtcNow.AddDays(-9), CreatedAt = DateTime.UtcNow.AddDays(-9), UpdatedAt = DateTime.UtcNow.AddDays(-9) }
            );
            context.SaveChanges();
        }
    }
}

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/test", () => "Hello from API!");

app.Run();