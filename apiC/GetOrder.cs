using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Square;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ACDerby.Functions
{
  public static class GetOrder
  {
    [FunctionName("GetOrder")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "order/{id}")] HttpRequest request,
        string id,
        ILogger log)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");

      if (request != null)
      {
        SquareClient _client = new SquareClient
                .Builder()
                .Environment(Square.Environment.Production)
                .AccessToken(System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_SquareAccessToken"))
                .Build();
        var result = await _client.OrdersApi.RetrieveOrderAsync(id);
        return new OkObjectResult(result.Order);
      }
      log.LogInformation($"Failed to update order.");
      return new NotFoundResult();
    }
  }
}
