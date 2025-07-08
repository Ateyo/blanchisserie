using Microsoft.EntityFrameworkCore;
using LaundryOrdersApi.Models; // Adjust namespace as needed

namespace LaundryOrdersApi.Data
{
    public class LaundryContext : DbContext
    {
        public LaundryContext(DbContextOptions<LaundryContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
    }
}