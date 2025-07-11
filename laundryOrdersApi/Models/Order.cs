namespace LaundryOrdersApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string? Username { get; set; }
        public DateTime? Date { get; set; }
        public required string Articles { get; set; }
        public string? Motif { get; set; }
        public string? Commentaire { get; set; }
        public string Status { get; set; } = "En attente"; // "Pending", "Validated", "Refused"
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}