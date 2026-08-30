using Microsoft.EntityFrameworkCore;

namespace mvcEjemplo1.Models
{
    public class CursoDbContext : DbContext
    {
        public CursoDbContext(DbContextOptions<CursoDbContext> options) : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }
    }
 }