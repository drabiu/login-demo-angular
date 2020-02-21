using Google.Apis.Auth;
using login_demo_backend.Models;
using System;
using System.Threading.Tasks;

namespace login_demo_backend.Token
{
    public class GoogleToken
    {
        private const string ClientId = "468923844593-uev8e0igl667dri8oqvpb9ilve2crfeh.apps.googleusercontent.com";

        public static async Task<UserResponse> ValidateCurrentToken(string token)
        {
            GoogleJsonWebSignature.Payload payload;
            payload = await GoogleJsonWebSignature.ValidateAsync(token, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { ClientId }
                });

            return new UserResponse(payload.Name, payload.Email, JwtToken.GenerateToken(Guid.NewGuid()), JwtToken.GenerateRefreshToken());
        }
    }
}
