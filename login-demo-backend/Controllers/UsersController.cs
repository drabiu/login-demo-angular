using login_demo_backend.Models;
using login_demo_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using login_demo_backend.Token;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace login_demo_backend.Controllers
{
    [Route("users")]
    [EnableCors("AllowOrigin")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/<controller>
        [HttpGet]
        [Authorize]
        public Task<IEnumerable<string>> Get()
        {
            return _userService.GetNames();
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        [Authorize]
        public string Get(int id)
        {
            return "value";
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("authenticate")]
        public async Task<IActionResult> Post([FromBody]Credentials credentials)
        {
            var user = await _userService.Authenticate(credentials);

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("googleSignIn")]
        public async Task<IActionResult> PostGoogle(string token)
        {
            var user = await GoogleToken.ValidateCurrentToken(token);

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("facebookSignIn")]
        public async Task<IActionResult> PostFacebook(string token)
        {
            var facebook = new FacebookToken();
            var user = await facebook.GetUserFromFacebookAsync(token);

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPut("create")]
        public IActionResult Put([FromBody]Credentials credentials)
        {
            _userService.Create(credentials);

            return Ok();
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        [Authorize]
        public void Delete(int id)
        {
        }
    }
}
