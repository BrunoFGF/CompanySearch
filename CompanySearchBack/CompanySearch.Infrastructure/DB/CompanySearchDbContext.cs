using Microsoft.EntityFrameworkCore;
using CompanySearch.Infrastructure.Models;

namespace CompanySearch.Infrastructure.DB
{
    public partial class CompanySearchDbContext : DbContext
    {
        public CompanySearchDbContext()
        {
        }

        public CompanySearchDbContext(DbContextOptions<CompanySearchDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Company> Companies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasIndex(e => e.Name, "IX_Companies_Name");
                entity.Property(e => e.Addresses).HasDefaultValue("[]");
                entity.Property(e => e.Countries).HasDefaultValue("[]");
                entity.Property(e => e.Name).HasMaxLength(200);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}