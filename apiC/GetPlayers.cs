using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using acderby.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ACDerby.Functions
{
    public static class GetPlayers
    {
        [FunctionName("GetPlayers")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "players/{teamId}")] HttpRequest req,
            [CosmosDB(
                "acderby",
                "players",
                Connection = "CosmosDbConnectionString",
                SqlQuery = "SELECT * FROM players where exists(select value t from t in players.teams where t.id = {teamId})")] IEnumerable<Person> players,
                ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            if (players == null)
            {
                log.LogInformation($"Players not found");
                return new NotFoundResult();
            }
            log.LogInformation($"Found players for team.");
            return new OkObjectResult(players);
        }
    }
}
