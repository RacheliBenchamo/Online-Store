using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductsController(DataContext context)
        {
            this._context = context;
        }

        // GET all products
        [HttpGet(Name = "GetAllProducts")]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            return Ok(await _context.Products.ToListAsync());
        }

        [HttpGet("{name}", Name = "GetProductByName")]
        public async Task<ActionResult<Product>> GetProductByName(string name)
        {
            Product product = await _context.Products.FirstOrDefaultAsync(u => u.Name == name);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // GET products by search term
        [HttpGet("search/{searchTerm}", Name = "GetProductsBySearchTerm")]
        public async Task<ActionResult<List<Product>>> GetBySearchTerm(string searchTerm)
        {
            var products = _context.Products
                .Where(p => p.Name.ToLower().Contains(searchTerm.ToLower()));

            return Ok(await products.ToListAsync());
        }


        [HttpGet("sorted/{sort}", Name = "GetSortedProducts")]
        public async Task<ActionResult<List<Product>>> GetSortedProducts(string sort)
        {
            var products = _context.Products.AsQueryable();

            switch (sort)
            {
                case "nameAsc":
                    products = products.OrderBy(p => p.Name);
                    break;
                case "nameDesc":
                    products = products.OrderByDescending(p => p.Name);
                    break;
                case "priceAsc":
                    products = products.OrderBy(p => p.Price);
                    break;
                case "priceDesc":
                    products = products.OrderByDescending(p => p.Price);
                    break;
                default:
                    products = products.OrderBy(p => p.Id);
                    break;
            }

            return Ok(await products.ToListAsync());
        }



        [HttpPost(Name = "CreateNewProduct")]
        public async Task<ActionResult<List<Product>>> AddNewProduct(ProductDto product)
        {
            Product productDb = new Product() { 
                Name = product.Name,
                Price = product.Price,
                Stock = product.Stock,
                Favorite = product.Favorite,
                ImgUrl = product.ImgUrl,
            };

            _context.Products.Add(productDb);
            await _context.SaveChangesAsync();

            return Ok(await _context.Products.ToListAsync());
        }

        [HttpPut("{name}")]
        public async Task<ActionResult<List<Product>>> UpdateProduct(string name, Product product)
        {
            Product dbProduct = await _context.Products.FirstOrDefaultAsync(u => u.Name == name);
            if (dbProduct == null)
                return BadRequest("Product Not Found.");

            dbProduct.Name = product.Name;
            dbProduct.ImgUrl = product.ImgUrl;
            dbProduct.Price = product.Price;
            dbProduct.Favorite = product.Favorite;
            dbProduct.Stock = product.Stock;

            await _context.SaveChangesAsync();

            return Ok(await _context.Products.ToListAsync());
        }


        [HttpDelete("{name}")]
        public async Task<ActionResult<List<Product>>> DeleteProduct(string name)
        {
            Product dbProduct = await _context.Products.FirstOrDefaultAsync(u => u.Name == name);
            if (dbProduct == null)
                return BadRequest("Product Not Found.");

            _context.Products.Remove(dbProduct);
            await _context.SaveChangesAsync();

            return Ok(await _context.Products.ToListAsync());
        }
    }

}