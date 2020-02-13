using System.ComponentModel.DataAnnotations;

namespace login_demo_backend.Models
{
    public class Credentials
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
