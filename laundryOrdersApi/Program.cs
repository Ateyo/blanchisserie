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
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
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
    //context.Users.RemoveRange(context.Users);
    //context.SaveChanges();
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
}

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/test", () => "Hello from API!");

app.Run();