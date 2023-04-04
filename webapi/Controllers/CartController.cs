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

        /**
         * Adds a product to the user's cart by email and product name.
         * @param email - The email of the user.
         * @param productName - The name of the product.
         * @returns The cart item added, or a NotFound response
         * if the product or user is not found.
         */
        [HttpPost("addToCart/email/{email}/productName/{productName}")]
        public async Task<IActionResult> AddToCart(string email, string productName)
        {
            Debug.WriteLine("in AddToCart");

            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == productName && p.Stock > 0);
            if (product == null)
            {
                return NotFound("Product not found or out of stock.");
            }

            var user = await _context.Users
               .FirstOrDefaultAsync(p => p.Email == email);
            if (user == null)
            {
                return NotFound("User not found.");
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
            return Ok(cartItem);
        }


        /**
        * Removes a specified Product from a specified user's cart.
        * @param email - The email address of the user whose cart should be updated.
        * @param productName - The name of the Product to remove from the cart.
        * @returns An ActionResult representing the success or failure of the operation.
        */
        [HttpPost("removeFromCart/email/{email}/productName/{productName}")]
        public async Task<ActionResult> RemoveFromCart(string email, string productName)
        {
            Debug.WriteLine("in RemoveFromCart");
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

        /**
        * Deletes all cart items associated with the given email.
        * @param email - The email of the client whose cart items will be deleted.
        * @returns A response indicating success or failure of the operation.
        */
        [HttpDelete("buy/email/{email}")]
        public async Task<ActionResult> ClearCart(string email)
        {
            Debug.WriteLine("in buy");
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


        /**
        * Gets the cart items for a given email.
        * @param email - The email of the client.
        * @returns A list of CartItemDto objects, or NotFound if no cart items were found for the given email.
        */
        [HttpGet("getCart/email/{email}")]
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


        /**
        * Updates the quantity of a cart item for a given user and product.
        * @param email - The email of the user.
        * @param productName - The name of the product.
        * @param newQuantity - The new quantity of the product.
        * @returns The updated cart item, or NotFound if the item or product is not found.
        */
        [HttpPut("email/{email}/prodName/{productName}/prodQuan/{newQuantity}")]
        public async Task<ActionResult<CartItem>> UpdateCartItemQuantity(string email, string productName, int newQuantity)
        {
            Debug.WriteLine("in UpdateCartItemQuantity");

            var cartItem = await _context.CartItems.FirstOrDefaultAsync
                (c => c.ClientEmail == email && c.ProductName == productName);

            if (cartItem == null)
            {
                return NotFound();
            }

            // Get the product
            var product = await _context.Products.SingleOrDefaultAsync(p =>
                p.Name == productName && p.Stock > (Math.Abs(newQuantity - cartItem.Quantity)));

            if (product == null)
            {
                return NotFound();
            }

            // Update the stock of the product
            product.Stock += cartItem.Quantity;
            product.Stock -= newQuantity;

            cartItem.Quantity = newQuantity;
            cartItem.PriceTotal = cartItem.PriceEach * newQuantity;

            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();

            return Ok(cartItem);
        }
    }
}
