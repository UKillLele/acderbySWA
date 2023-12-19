using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Square.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Xml.Linq;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

namespace ACDerby.Functions
{
  public static class ValidateAddress
  {
    [FunctionName("ValidateAddress")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "validate-address")] HttpRequest req,
        ILogger log)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");
      string requestBody = string.Empty;
      using (StreamReader streamReader = new(req.Body))
      {
        requestBody = await streamReader.ReadToEndAsync();
      }

      log.LogInformation(requestBody);
      acderby.Models.Address address = JsonConvert.DeserializeObject<acderby.Models.Address>(requestBody);

      if (address != null)
      {
        var username = System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_USPSUsername");
        var password = System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_USPSPassword");

        XDocument requestDoc = new XDocument(
            new XElement("AddressValidateRequest",
                new XAttribute("USERID", $"{username}"),
                new XAttribute("PASSWORD", $"{password}"),
                new XElement("Revision", "1"),
                new XElement("Address",
                    new XAttribute("ID", "0"),
                    new XElement("Address1", $"{address.Address2}"),
                    new XElement("Address2", $"{address.Address1}"),
                    new XElement("City", $"{address.City}"),
                    new XElement("State", $"{address.State}"),
                    new XElement("Zip5", $"{address.Zipcode}"),
                    new XElement("Zip4", "")
                )
            )
        );

        try
        {
          var url = "http://production.shippingapis.com/ShippingAPI.dll?API=Verify&XML=" + requestDoc;
          // HttpClient won't work here
          var client = new WebClient();
          var result = client.DownloadString(url);

          var xdoc = XDocument.Parse(result.ToString());
          var parsedAddress = xdoc.Descendants("Address");
          var response = new acderby.Models.Address()
          {
            Address1 = parsedAddress?.Elements("Address2")?.FirstOrDefault()?.Value,
            Address2 = parsedAddress?.Elements("Address1")?.FirstOrDefault()?.Value,
            City = parsedAddress?.Elements("City")?.FirstOrDefault()?.Value,
            State = parsedAddress?.Elements("State")?.FirstOrDefault()?.Value,
            Zipcode = $"{parsedAddress?.Elements("Zip5")?.FirstOrDefault()?.Value}-{parsedAddress?.Elements("Zip4")?.FirstOrDefault()?.Value}",
            ReturnText = parsedAddress?.Elements("ReturnText")?.FirstOrDefault()?.Value
          };
          if (response.Address1 == null)
          {
            var error = parsedAddress?.Elements("Error");
            return new OkObjectResult(JsonConvert.SerializeObject(error?.Elements("Description")?.FirstOrDefault()?.Value));
          }
          return new OkObjectResult(response);
        }
        catch (ApiException ex)
        {
          return new BadRequestObjectResult(ex.Errors);
        }
      }
      log.LogInformation($"Failed to validate address.");
      return new NotFoundResult();
    }
  }
}
