using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using System.Net;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.Functions.Worker.Http;
using acderby.Models;
using System.Collections.Generic;
using Microsoft.Azure.Cosmos;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACDerby.Functions
{
    public static class GetTeam
    {
        [FunctionName("GetTeam")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "teams/{slug}")] HttpRequestData req,
            [CosmosDBInput(
                "acderby",
                "teams",
                Connection = "CosmosDbConnectionString",
                SqlQuery = "SELECT TOP 1 * FROM teams WHERE teams.slug={slug}"
            )] Team team,
            ILogger logger,
            string slug)
        {
            if (team == null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(team);
        }
    }
}
