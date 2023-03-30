using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options):base(options) {}

        public DbSet<Product> Products => Set<Product>();

        public DbSet<User> Users => Set<User>();
    }
}
