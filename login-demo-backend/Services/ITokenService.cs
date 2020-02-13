using System.Threading.Tasks;
using login_demo_backend.Models;

namespace login_demo_backend.Services
{
    public interface ITokenService
    {
        Task<UserResponse> Refresh(string refreshToken);
        void Revoke(string token);
    }
}
