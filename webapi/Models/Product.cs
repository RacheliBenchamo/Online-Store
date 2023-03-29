namespace webapi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Price { get; set; }
        public List<string> Tags { get; set; }=new List<string>();
        public bool Favorite { get; set; } = false;
        public string ImgUrl { get; set; } = string.Empty;
    }
}
