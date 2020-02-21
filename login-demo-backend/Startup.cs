using System.Text;
using login_demo_backend.Middlewares;
using login_demo_backend.Models;
using login_demo_backend.Password;
using login_demo_backend.Services;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace login_demo_backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<HashingOptions>(Configuration);
            services.Configure<TokenOptions>(Configuration);

            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITokenService, TokenService>();

            var key = Encoding.ASCII.GetBytes(JwtToken.MySecret);
            services.AddAuthentication(a =>
            {
                a.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                a.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(b =>
            {
                b.RequireHttpsMetadata = false;
                b.SaveToken = true;
                b.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true
                };
            });
            //    .AddFacebook(facebookOptions =>
            //{
            //    facebookOptions.AppId = "635984350523176";//Configuration["Authentication:Facebook:AppId"];
            //    facebookOptions.AppSecret = "a543a839a7c07e98c26d44392a9bebf2"; //Configuration["Authentication:Facebook:AppSecret"];
            //});
            //}).AddGoogle(options =>
            //    {
            //        IConfigurationSection googleAuthNSection =
            //            Configuration.GetSection("Authentication:Google");

            //        options.ClientId = "468923844593-uev8e0igl667dri8oqvpb9ilve2crfeh.apps.googleusercontent.com"; //googleAuthNSection["ClientId"];
            //        options.ClientSecret = "4AHlD8BmW6g8HQ3krtYoJ5_T"; //googleAuthNSection["ClientSecret"];
            //    });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                    builder => 
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();

            //app.UseOptions();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            DocumentDBRepository<User>.Initialize();
        }
    }
}
