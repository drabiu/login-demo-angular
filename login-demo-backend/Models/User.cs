using Newtonsoft.Json;

namespace login_demo_backend.Models
{
    public class User
    {
        public string UserName { get; }
        public string UserId { get; }
        public string PasswordHash { get; }
        public string RefreshToken { get; private set; }
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        protected User()
        {
        }

        public User(string userName, string userId, string passwordHash, string refreshToken)
        {
            UserName = userName;
            PasswordHash = passwordHash;
            UserId = userId;
            RefreshToken = refreshToken;
        }

        public void UpdateRefreshToken(string refreshToken)
        {
            RefreshToken = refreshToken;
        }
    }
}
