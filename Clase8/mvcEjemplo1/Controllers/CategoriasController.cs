using Microsoft.AspNetCore.Mvc;
using mvcEjemplo1.Models;

namespace mvcEjemplo1.Controllers;
public class CategoriasController : Controller
{
    private readonly CursoDbContext _context;

    public CategoriasController(CursoDbContext context)
    {
        _context = context;
    }

    // GET: Categorias
    public IActionResult Index()
    {
        return View(_context.Categorias.ToList());
    }
}