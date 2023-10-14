using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_apigateway_ocelot.middleware
{
       public class AddUserIdToHeaderMiddleware
    {
        private readonly RequestDelegate _next;

        public AddUserIdToHeaderMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                var userId = context.User.Claims.First(c => c.Type == "UserId").Value;
                context.Request.Headers.Add("UserId", userId);
            }

            await _next(context);
        }
    }
}