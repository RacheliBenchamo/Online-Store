using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Xml.Linq;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CartController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public CartController(IConfiguration configuration, DataContext context)
        {
            this._context = context;
            this._configuration = configuration;
        }

        //add to cart
        [HttpPost("email/{email}/productName/{productName}")]
        public async Task<IActionResult> AddToCart(string email, string productName)
        {
            Debug.WriteLine("email - " + email);
            Debug.WriteLine("productName - " + productName);

            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == productName);
            if (product == null)
            {
                return NotFound("Product not found or out of stock.");
            }

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.ClientEmail == email && c.ProductName == productName);
            if (cartItem != null)
            {
                cartItem.Quantity++;
                cartItem.PriceTotal += product.Price;
            }
            else
            {
                cartItem = new CartItem
                {
                    ClientEmail = email,
                    ProductName = productName,
                    Quantity = 1,
                    PriceEach = product.Price,
                    PriceTotal = product.Price,
                };
                _context.CartItems.Add(cartItem);
            }

            product.Stock--;
            _context.Entry(product).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return Ok();
        }

        //remove from cart
        [HttpPost("remove-from-cart")]
        public async Task<ActionResult> RemoveFromCart(string email, string productName)
        {
            // Get the cart item for the client and product name
            var cartItem = await _context.CartItems.SingleOrDefaultAsync(ci =>
                ci.ClientEmail == email && ci.ProductName == productName);

            if (cartItem == null)
            {
                return NotFound();
            }

            // Get the product
            var product = await _context.Products.SingleOrDefaultAsync(p =>
                p.Name == productName);

            if (product == null)
            {
                return NotFound();
            }

            // Update the stock of the product
            product.Stock += cartItem.Quantity;

            // Remove the cart item
            _context.CartItems.Remove(cartItem);

            await _context.SaveChangesAsync();

            return Ok();
        }

        //buy the cart
        [HttpDelete("{email}")]
        public async Task<IActionResult> ClearCart(string email)
        {
            try
            {
                // Find all cart items associated with the given email
                var cartItems = await _context.CartItems.Where(ci => ci.ClientEmail == email).ToListAsync();

                // Remove the cart items
                _context.CartItems.RemoveRange(cartItems);

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        //get client cart
        [HttpGet("{email}")]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCart(string email)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.ClientEmail == email)
                .Select(c => new CartItemDto
                {
                    ProductName = c.ProductName,
                    Quantity = c.Quantity,
                    PriceEach = c.PriceEach,
                    PriceTotal = c.PriceTotal
                })
                .ToListAsync();

            if (cartItems == null)
            {
                return NotFound();
            }

            return Ok(cartItems);
        }


        //change quantity
        [HttpPut("{email}/{productName}")]
        public async Task<IActionResult> UpdateCartItemQuantity(string email, string productName, [FromBody] int newQuantity)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync
                (c => c.ClientEmail == email && c.ProductName == productName);

            if (cartItem == null)
            {
                return NotFound();
            }

            cartItem.Quantity = newQuantity;
            cartItem.PriceTotal = cartItem.PriceEach * newQuantity;

            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();

            return Ok(cartItem);
        }

    }
}
