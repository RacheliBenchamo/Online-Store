namespace webapi.Models
{
    public class ProductDto
    {
        public string Name { get; set; } = string.Empty;
        public double Price { get; set; }
        public bool Favorite { get; set; } = false;
        public string ImgUrl { get; set; } = string.Empty;
        public int Stock { get; set; }
    }
}
