using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using acderby.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ACDerby.Functions
{
    public static class GetTeams
    {
        [FunctionName("GetTeams")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "teams")] HttpRequest req,
            [CosmosDB(
                "acderby",
                "teams",
                Connection = "CosmosDbConnectionString",
                SqlQuery = "SELECT * FROM teams")] IEnumerable<Team> teams,
                ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            if (teams == null)
            {
                log.LogInformation($"Teams not found");
                return new NotFoundResult();
            }
            log.LogInformation($"Found Teams");
            return new OkObjectResult(teams);
        }
    }
}
