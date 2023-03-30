using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace YourNamespace.API
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

        [HttpGet("{id}", Name = "GetProductById")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);
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
        public async Task<ActionResult<List<Product>>> AddNewProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(await _context.Products.ToListAsync());
        }

        [HttpPut]
        public async Task<ActionResult<List<Product>>> UpdateProduct(Product product)
        {
            var dbProduct = await _context.Products.FindAsync(product.Id);
            if (dbProduct == null)
                return BadRequest("Product Not Found.");

            dbProduct.Name = product.Name;
            dbProduct.ImgUrl = product.ImgUrl;
            dbProduct.Price = product.Price;
            dbProduct.Favorite = product.Favorite;

            await _context.SaveChangesAsync();

            return Ok(await _context.Products.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Product>>> DeleteProduct(int id)
        {
            var dbProduct = await _context.Products.FindAsync(id);
            if (dbProduct == null)
                return BadRequest("Product Not Found.");

            _context.Products.Remove(dbProduct);
            await _context.SaveChangesAsync();

            return Ok(await _context.Products.ToListAsync());
        }
    }

}