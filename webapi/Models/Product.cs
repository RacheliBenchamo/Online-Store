namespace webapi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string[] Tags { get; set; }
        public bool Favorite { get; set; } = false;
        public string ImgUrl { get; set; }
    }
}
