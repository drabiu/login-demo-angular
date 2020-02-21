using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Threading.Tasks;
using login_demo_backend.Models;
using Newtonsoft.Json.Linq;

namespace login_demo_backend.Token
{
    public class FacebookToken
    {
        private readonly HttpClient _httpClient;

        public FacebookToken()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://graph.facebook.com/v6.0/")
            };

            _httpClient.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<UserResponse> GetUserFromFacebookAsync(string facebookToken)
        {
            var result = await GetAsync<dynamic>(facebookToken, "me", "fields=first_name,last_name,email,picture.width(100).height(100)");
            if (result == null)
            {
                throw new Exception("User from this token not exist");
            }

            var userName = ((JValue) ((IDictionary<string, JToken>) result)["last_name"]).Value.ToString();
            var userId = ((JValue)((IDictionary<string, JToken>)result)["id"]).Value.ToString();

            return new UserResponse(userName, userId, JwtToken.GenerateToken(Guid.NewGuid()), JwtToken.GenerateRefreshToken());
        }

        private async Task<T> GetAsync<T>(string accessToken, string endpoint, string args = null)
        {
            var response = await _httpClient.GetAsync($"{endpoint}?access_token={accessToken}&{args}");
            if (!response.IsSuccessStatusCode)
                return default(T);

            var result = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<T>(result);
        }
    }
}
