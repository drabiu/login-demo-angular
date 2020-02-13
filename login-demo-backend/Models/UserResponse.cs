using System;

namespace login_demo_backend.Models
{
    public class UserResponse
    {
        public string UserName { get; }
        public string UserId { get; }
        public string Token { get; }
        public string RefreshToken { get; }

        protected UserResponse()
        {
        }

        public UserResponse(string userName, string userId, string token, string refreshToken)
        {
            UserName = userName;
            UserId = userId;
            Token = token;
            RefreshToken = refreshToken;
        }
    }
}
