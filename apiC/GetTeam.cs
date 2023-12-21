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
    public static class GetTeam
    {
        [FunctionName("GetTeam")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "teams/{slug}")] HttpRequest req,
            [CosmosDB(
                "acderby",
                "teams",
                Connection = "CosmosDbConnectionString",
                SqlQuery = "SELECT * FROM teams t WHERE t.slug = {slug}")] IEnumerable<Team> teams,
                ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            if (teams == null)
            {
                log.LogInformation($"Team not found");
                return new NotFoundResult();
            }
            var team = teams.ToList()[0];
            log.LogInformation($"Found Team {teams.ToList()[0].Name}");
            return new OkObjectResult(team);
        }
    }
}
