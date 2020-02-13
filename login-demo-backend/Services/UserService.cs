using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using login_demo_backend.Models;

namespace login_demo_backend.Services
{
    public class UserService : IUserService
    {
        private readonly IPasswordHasher _passwordHasher;

        public UserService(IPasswordHasher passwordHasher)
        {
            _passwordHasher = passwordHasher;
        }

        public async Task<UserResponse> Authenticate(Credentials credentials)
        {
            var users = await DocumentDBRepository<User>.GetItemsAsync(u => u.UserName == credentials.Username);
            var user = users.SingleOrDefault();
            if (user == null)
            {
                throw new NullReferenceException("User does not exist");
            }

            var (verified, needsUpgrade) = _passwordHasher.Check(user.PasswordHash, credentials.Password);
            if (!verified || needsUpgrade)
            {
                throw new KeyNotFoundException("Invalid password");
            }

            var token = JwtToken.GenerateToken(new Guid(user.UserId));
            user.UpdateRefreshToken(JwtToken.GenerateRefreshToken());

            await DocumentDBRepository<User>.UpdateItemAsync(user.Id, user);

            return new UserResponse(user.UserName, user.UserId, token, user.RefreshToken);
        }

        public async void Create(Credentials credentials)
        {
            var user = new User(credentials.Username, Guid.NewGuid().ToString(),
                _passwordHasher.Hash(credentials.Password), JwtToken.GenerateRefreshToken());

            await DocumentDBRepository<User>.CreateItemAsync(user);
        }

        public async Task<IEnumerable<string>> GetNames()
        {
            var users = await DocumentDBRepository<User>.GetItemsAsync(u => true);

            return users.Select(u => u.UserName);
        }
    }
}
