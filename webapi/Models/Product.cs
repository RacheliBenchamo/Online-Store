namespace webapi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Price { get; set; }
        public bool Favorite { get; set; } = false;
        public string ImgUrl { get; set; } = string.Empty;
    }
}
