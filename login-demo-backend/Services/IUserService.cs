using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using login_demo_backend.Models;

namespace login_demo_backend.Services
{
    public interface IUserService
    {
        Task<UserResponse> Authenticate(Credentials credentials);
        void Create(Credentials credentials);
        Task<IEnumerable<string>> GetNames();
    }
}
