using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

using LaundryOrdersApi.Models; // Adjust namespace as needed

namespace LaundryOrdersApi.Data
{
    public class LaundryContext : DbContext
    {
        public LaundryContext(DbContextOptions<LaundryContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed a dummy user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "testuser",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("testuser"),
                    Role = "User"
                }
            );

            // Seed dummy orders
            modelBuilder.Entity<Order>().HasData(
                new Order
                {
                    Id = 1,
                    UserId = 1, // Link to the dummy user
                    Date = DateTime.UtcNow.AddDays(-7),
                    Articles = "Chemise, Pantalon",
                    IdentityName = "Test User",
                    Motif = "Nettoyage à sec",
                    Commentaire = "Tâche difficile",
                    Status = "En attente",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    UpdatedAt = DateTime.UtcNow.AddDays(-7)
                },
                new Order
                {
                    Id = 2,
                    UserId = 1, // Link to the dummy user
                    Date = DateTime.UtcNow.AddDays(-3),
                    Articles = "Robe, Jupe",
                    IdentityName = "Test User",
                    Motif = "Lavage délicat",
                    Commentaire = "Sans commentaire",
                    Status = "Validée",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                }
            );
        }
    }
}