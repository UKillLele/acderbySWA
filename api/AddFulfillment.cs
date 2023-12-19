using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using acderby.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using Square.Models;
using Square;
using Square.Exceptions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using Newtonsoft.Json;

namespace ACDerby.Functions
{
  public static class AddFulfillment
  {
    [FunctionName("AddFulfillment")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "add-fulfillment")] HttpRequest req,
        ILogger log)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");
      string requestBody = string.Empty;
      using (StreamReader streamReader = new(req.Body))
      {
        requestBody = await streamReader.ReadToEndAsync();
      }
      AddFulfillmentRequest request = JsonConvert.DeserializeObject<AddFulfillmentRequest>(requestBody);

      if (request != null)
      {
        SquareClient _client = new SquareClient
                .Builder()
                .Environment(Square.Environment.Production)
                .AccessToken(System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_SquareAccessToken"))
                .Build();
        var fulfillments = new List<Fulfillment>();
        var serviceCharges = new List<OrderServiceCharge>();

        if (request.Fulfillment == "shipment")
        {
          var amount = new Money(600, "USD");
          OrderServiceCharge serviceCharge = new OrderServiceCharge(name: "Shipping", amountMoney: amount, calculationPhase: "TOTAL_PHASE");
          serviceCharges.Add(serviceCharge);

          var address = new Square.Models.Address(request.Address1, request.Address2, null, request.State, request.City, postalCode: request.Zipcode);
          var recipient = new FulfillmentRecipient(null, request.DisplayName, request.EmailAddress, request.PhoneNumber, address);
          var shipmentDetails = new FulfillmentShipmentDetails(recipient);
          var fulfillment = new Fulfillment(uid: request.FulfillmentUid ?? null, type: "SHIPMENT", shipmentDetails: shipmentDetails);
          fulfillments.Add(fulfillment);
        }
        else
        {
          var recipient = new FulfillmentRecipient(null, request.DisplayName, request.EmailAddress, request.PhoneNumber);
          var pickupDetails = new FulfillmentPickupDetails(recipient, pickupAt: "3000-01-01");
          var fulfillment = new Fulfillment(uid: request.FulfillmentUid ?? null, type: "PICKUP", pickupDetails: pickupDetails);
          fulfillments.Add(fulfillment);
        }

        var order = new Order.Builder(locationId: System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_SquareLocationId"))
          .Version(request.Version)
          .Fulfillments(fulfillments)
          .ServiceCharges(serviceCharges)
          .State("OPEN")
          .Build();

        var body = new UpdateOrderRequest.Builder()
            .Order(order)
            .IdempotencyKey(Guid.NewGuid().ToString())
            .Build();

        try
        {
          var result = await _client.OrdersApi.UpdateOrderAsync(request.OrderId, body);

          return new OkObjectResult(result.Order);
        }
        catch (ApiException ex)
        {
          return new BadRequestObjectResult(ex.Errors);
        }
      }
      log.LogInformation($"Failed to update order.");
      return new NotFoundResult();
    }
  }
}
