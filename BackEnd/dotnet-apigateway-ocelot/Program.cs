
using Ocelot.Cache.CacheManager;
using Ocelot.DependencyInjection;
using Ocelot.LoadBalancer.LoadBalancers;
using Ocelot.Middleware;
using Ocelot.Responses;
using Ocelot.Values;

using Ocelot.Provider.Eureka;
using Ocelot.Provider.Polly;
using Steeltoe.Discovery.Client;
using dotnet_apigateway_ocelot.middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;  // Added for JWT Bearer
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;  // Added for JWT Bearer


var builder = WebApplication.CreateBuilder(args);


// you can use this style...
IConfiguration configuration = new ConfigurationBuilder().AddJsonFile("ocelot.json").Build();
builder.Services.AddOcelot(configuration)
.AddEureka()
.AddPolly();


// // Adding JWT Bearer authentication
// builder.Services.AddAuthentication(options => // Added for JWT Bearer
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("UserAuthSecret")),
//         ValidateIssuer = false,
//         ValidateAudience = false,
//         ValidateLifetime = true,
//     };
// });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// eureka
builder.Services.AddDiscoveryClient(builder.Configuration);
builder.Services.AddCors();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// app.UseAuthentication();  // Added for JWT Bearer
// app.UseAuthorization();  // Added for JWT Bearer

// app.UseMiddleware<AddUserIdToHeaderMiddleware>(); // Added for JWT Bearer


// ocelot
await app.UseOcelot();

app.MapGet("/", () => "Hello World!");

app.Run();
