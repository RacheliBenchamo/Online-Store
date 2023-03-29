using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using webapi.Models;

namespace YourNamespace.API
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {

        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        // public ProductsController() { }



        // GET products
        [HttpGet(Name = "GetAllProducts")]
        public Product[] Get()
        {
            return new Product[]{
        new Product
        {
            Id = 1,
            Name = "Broccoli",
            Price = 2,
            Tags = { "good", "green" },
            Favorite = true,
            ImgUrl = ""
        },
        new Product
        {
            Id = 2,
            Name = "Carrot",
            Price = 1,
            Tags = { "crunchy", "orange" },
            Favorite = false,
            ImgUrl = ""
        },
                // Add more products here as needed
        };

        }

    }
}
