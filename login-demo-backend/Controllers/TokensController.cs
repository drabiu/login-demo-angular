using login_demo_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using login_demo_backend.Models;

namespace login_demo_backend.Controllers
{
    [Route("tokens")]
    [EnableCors("AllowOrigin")]
    public class TokensController : Controller
    {
        private readonly ITokenService _tokenService;

        public TokensController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("refresh")]
        public async Task<UserResponse> Refresh(string refreshToken)
        {
            var userResponse = await _tokenService.Refresh(refreshToken);

            return userResponse;
        }

        [HttpPost("revoke")]
        [Authorize]
        public IActionResult Revoke(string refreshToken)
        {
            _tokenService.Revoke(refreshToken);

            return Ok();
        }
    }
}