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
            if (order == null || string.IsNullOrWhiteSpace(order.Articles) || order.Date == null)
                return BadRequest("Date et articles sont obligatoires.");

            // Associer l'utilisateur connecté et définir les dates
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            var usernameClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Name);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId) || usernameClaim == null)
                return Unauthorized("Utilisateur non authentifié ou ID utilisateur introuvable.");

            order.UserId = userId;
            order.Username = usernameClaim.Value;
            order.Status = "En attente"; // Statut initial
            order.CreatedAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;

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
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Utilisateur non authentifié ou ID utilisateur introuvable.");

            var orders = _context.Orders.Where(o => o.UserId == userId).ToList();
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