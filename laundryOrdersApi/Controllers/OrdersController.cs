using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LaundryOrdersApi.Data;
using LaundryOrdersApi.Models;
using System.Linq;

namespace LaundryOrdersApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly LaundryContext _context;
        public OrdersController(LaundryContext context) => _context = context;

        [Authorize]
        [HttpPost]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            // Validation des champs requis
            if (order == null || string.IsNullOrWhiteSpace(order.Articles) || order.Date == default)
                return BadRequest("Date et articles sont obligatoires.");

            // Associer l'utilisateur connecté
            if (User?.Identity?.Name == null)
                return Unauthorized("Utilisateur non authentifié.");
            order.IdentityName = User.Identity.Name;
            order.Status = "En attente"; // Statut initial

            _context.Orders.Add(order);
            _context.SaveChanges();

            return Ok(order);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetAllOrders() => Ok(_context.Orders.ToList());

        [Authorize]
        [HttpGet("mine")]
        public IActionResult GetMyOrders()
        {
            if (User?.Identity?.Name == null)
                return Unauthorized("Utilisateur non authentifié.");
            var username = User.Identity.Name;
            var orders = _context.Orders.Where(o => o.IdentityName == username).ToList();
            return Ok(orders);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/validate")]
        public IActionResult ValidateOrder(int id)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound();

            order.Status = "Validée";
            _context.SaveChanges();
            return Ok(order);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/refuse")]
        public IActionResult RefuseOrder(int id)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound();

            order.Status = "Refusée";
            _context.SaveChanges();
            return Ok(order);
        }
    }
}