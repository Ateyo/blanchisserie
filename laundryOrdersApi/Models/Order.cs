namespace LaundryOrdersApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required User User { get; set; }
        public DateTime Date { get; set; }
        public required string Articles { get; set; }
        public required string IdentityName { get; set; } // Nom prénom etc.
        public string? Motif { get; set; }
        public string? Commentaire { get; set; }
        public required string Status { get; set; } // "Pending", "Validated", "Refused"
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}