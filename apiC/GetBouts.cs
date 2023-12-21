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
    public static class GetBouts
    {
        [FunctionName("GetBouts")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "bouts")] HttpRequest req,
            [CosmosDB(
                "acderby",
                "bouts",
                Connection = "CosmosDbConnectionString",
                SqlQuery = "SELECT * FROM bouts")] IEnumerable<Bout> bouts,
                ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            if (bouts == null)
            {
                log.LogInformation($"Bouts not found");
                return new NotFoundResult();
            }
            log.LogInformation($"Found bouts.");
            return new OkObjectResult(bouts.GroupBy(x => x.Date.Date));
        }
    }
}
