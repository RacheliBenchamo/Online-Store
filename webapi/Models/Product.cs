namespace webapi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Price { get; set; }
        public string[] Tags { get; set; } = new string[0];
        public bool Favorite { get; set; } = false;
        public string ImgUrl { get; set; } = string.Empty;
    }
}
