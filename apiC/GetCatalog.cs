using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Square.Models;
using Square;
using Square.Exceptions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.IO;
using Newtonsoft.Json;

namespace ACDerby.Functions
{
  public static class GetCatalog
  {
    [FunctionName("GetCatalog")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "catalog")] HttpRequest request,
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
        IList<CatalogObject> categories;
        try
        {
          var response = await _client.CatalogApi.ListCatalogAsync(null, "CATEGORY");
          categories = response.Objects;
        }
        catch (ApiException ex)
        {
          return new BadRequestObjectResult(ex.Errors);
        }

        string category = request.Query["category"];

        string requestBody = string.Empty;
        using (StreamReader streamReader = new StreamReader(request.Body))
        {
          requestBody = await streamReader.ReadToEndAsync();
        }
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        category ??= data?.category;

        List<CatalogObject> items;
        try
        {
          var objectTypes = new List<string>() { "ITEM" };
          var exactQuery = new CatalogQueryExact("category_id", categories.FirstOrDefault(x => x.CategoryData?.Name == (category == "tickets" ? "Presale" : "Merchandise"))?.Id);
          var query = new CatalogQuery(exactQuery: exactQuery);
          var response = await _client.CatalogApi.SearchCatalogObjectsAsync(new SearchCatalogObjectsRequest(objectTypes: objectTypes, query: query));
          items = response.Objects.ToList();
        }
        catch (ApiException ex)
        {
          return new BadRequestObjectResult(ex.Errors);
        }

        try
        {
          var response = await _client.CatalogApi.ListCatalogAsync(null, "IMAGE");
          items.AddRange(response.Objects);
        }
        catch (ApiException ex)
        {
          return new BadRequestObjectResult(ex.Errors);
        }

        return new OkObjectResult(items);
      }
      log.LogInformation($"Failed to update order.");
      return new NotFoundResult();
    }
  }
}
