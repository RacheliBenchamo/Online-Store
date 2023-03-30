


using Microsoft.AspNetCore.Mvc;
using webapi.Data;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController
    {

        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            this._context = context;
        }




    }
}
