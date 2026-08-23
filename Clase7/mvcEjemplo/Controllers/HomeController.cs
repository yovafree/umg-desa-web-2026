using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using mvcEjemplo.Models;

namespace mvcEjemplo.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    private List<Persona> personas;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;

        personas = new List<Persona>
        {
            new Persona { Nombre = "Juan", Edad = 25, Ciudad = "Ciudad A" },
            new Persona { Nombre = "María", Edad = 30, Ciudad = "Ciudad B" },
            new Persona { Nombre = "Pedro", Edad = 28, Ciudad = "Ciudad C" },
            new Persona { Nombre = "Ana", Edad = 22, Ciudad = "Ciudad D" },
            new Persona { Nombre = "Luis", Edad = 35, Ciudad = "Ciudad E" },
            new Persona { Nombre = "Sofía", Edad = 27, Ciudad = "Ciudad F" },
            new Persona { Nombre = "Carlos", Edad = 32, Ciudad = "Ciudad G" },
            new Persona { Nombre = "Lucía", Edad = 29, Ciudad = "Ciudad H" },
            new Persona { Nombre = "Miguel", Edad = 31, Ciudad = "Ciudad I" },
            new Persona { Nombre = "Valentina", Edad = 26, Ciudad = "Ciudad J" }
        };
    }

    public IActionResult Index()
    {
        ViewBag.personas = personas;
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult About()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
