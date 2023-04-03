namespace webapi.Models
{
    public class CartItemDto
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public double PriceEach { get; set; }
        public double PriceTotal { get; set; }
    }
}
