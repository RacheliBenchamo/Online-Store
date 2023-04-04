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

        /**
        * Get all products in the database.
        * @return {Task<ActionResult<List<Product>>>} List of all products in the database.
        */
        [HttpGet(Name = "GetAllProducts")]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            return Ok(await _context.Products.ToListAsync());
        }

        /**
        * Retrieve a product from the database by its name.
        * @param name The name of the product to retrieve.
        * @return If the product is found, returns an HTTP 200 OK status code and the requested product.
        * If the product is not found, returns an HTTP 404 Not Found status code.
        */
        [HttpGet("{name}", Name = "GetProductByName")]
        public async Task<ActionResult<Product>> GetProductByName(string name)
        {
            Product product = await _context.Products.FirstOrDefaultAsync(u => u.Name == name);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        /**
        * Returns a list of products whose names contain the given search term.
        * @param searchTerm The search term to use when filtering products.
        * @return An ActionResult containing a list of products whose names contain the given search term.
        */
        [HttpGet("search/{searchTerm}", Name = "GetProductsBySearchTerm")]
        public async Task<ActionResult<List<Product>>> GetBySearchTerm(string searchTerm)
        {
            var products = _context.Products
                .Where(p => p.Name.ToLower().Contains(searchTerm.ToLower()));

            return Ok(await products.ToListAsync());
        }

        /**
        * Returns a list of products sorted based on the specified parameter.
        * @param sort The sorting parameter. Can be one of "nameAsc", "nameDesc", "priceAsc", or "priceDesc".
        * @return A list of products sorted based on the specified parameter.
        */
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


        /**
        * Create a new product
        * @param product - A ProductDto object that represents the new product to be created.
        * @return Returns an ActionResult with a List of all products including the newly created product.
        */
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

        /**
        * Update a product by name.
        * @param name The name of the product to update.
        * @param product An object containing the updated product information.
        * @return The list of all products after the update has been made.
        */
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

        /**
        * Deletes a specific product by name
        * @param name {string} The name of the product to delete
        * @returns {ActionResult<List<Product>>} A list of all remaining products after deletion
        */
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