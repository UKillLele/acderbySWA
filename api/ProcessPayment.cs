using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using acderby.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace ACDerby.Functions
{
  public static class ProcessPayment
  {
    [FunctionName("ProcessPayment")]
    public static IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "process-payment")] HttpRequest req,
        ILogger log)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");

      // if (bouts == null)
      // {
      //   log.LogInformation($"Bouts not found");
      //   return new NotFoundResult();
      // }
      log.LogInformation($"Found bouts.");
      return new OkResult();
    }
  }
}
