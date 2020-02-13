using login_demo_backend.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace login_demo_backend.Services
{
    public class TokenService : ITokenService
    {
        public async Task<UserResponse> Refresh(string refreshToken)
        {
            var users = await DocumentDBRepository<User>.GetItemsAsync(u => u.RefreshToken == refreshToken);
            var user = users.SingleOrDefault();
            if (user == null)
                throw new NullReferenceException("User does not exist");

            if (user.RefreshToken != refreshToken)
                throw new SecurityTokenException("Invalid refresh token");

            var newToken = JwtToken.GenerateToken(new Guid(user.UserId));
            var newRefreshToken = JwtToken.GenerateRefreshToken();
            user.UpdateRefreshToken(newRefreshToken);

            await DocumentDBRepository<User>.UpdateItemAsync(user.Id, user);

            return new UserResponse(user.UserName, user.UserId, newToken, newRefreshToken);
        }

        public async void Revoke(string refreshToken)
        {
            var users = await DocumentDBRepository<User>.GetItemsAsync(u => u.RefreshToken == refreshToken);
            var user = users.SingleOrDefault();
            if (user == null)
                throw new NullReferenceException("User does not exist");

            user.UpdateRefreshToken(string.Empty);

            await DocumentDBRepository<User>.UpdateItemAsync(user.Id, user);
        }
    }
}
