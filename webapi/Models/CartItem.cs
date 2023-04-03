namespace webapi.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public string ClientEmail { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public double PriceEach { get; set; }
        public double PriceTotal { get; set; }
    }
}
