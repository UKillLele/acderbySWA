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
  public static class UpdateOrder
  {
    [FunctionName("UpdateOrder")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "update-order")] HttpRequest req,
        ILogger log)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");
      string requestBody = string.Empty;
      using (StreamReader streamReader = new(req.Body))
      {
        requestBody = await streamReader.ReadToEndAsync();
      }
      OrderAddItemRequest request = JsonConvert.DeserializeObject<OrderAddItemRequest>(requestBody);

      if (request != null)
      {
        SquareClient _client = new SquareClient
                .Builder()
                .Environment(Square.Environment.Production)
                .AccessToken(System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_SquareAccessToken"))
                .Build();
        var lineItems = new List<OrderLineItem>();
        var itemsToRemove = new List<string>();
        foreach (var item in request.Items)
        {

          if (item.Uid != null)
          {
            if (Int32.Parse(item.Quantity) > 0)
            {
              var orderLineItem = new OrderLineItem.Builder(quantity: item.Quantity)
                .Uid(item.Uid)
                .Build();

              lineItems.Add(orderLineItem);
            }
            else
            {
              itemsToRemove.Add($"line_items[{item.Uid}]");
            }
          }
          else
          {
            var orderLineItem = new OrderLineItem.Builder(quantity: item.Quantity)
              .CatalogObjectId(item.LineItemId)
              .Build();

            lineItems.Add(orderLineItem);
          }
        }

        var pricingOptions = new OrderPricingOptions.Builder()
          .AutoApplyDiscounts(true)
          .Build();

        var order = new Order.Builder(locationId: System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_SquareLocationId"))
          .LineItems(lineItems)
          .PricingOptions(pricingOptions)
          .Version(request.Version)
          .Build();

        if (request.OrderId != null)
        {
          var body = new UpdateOrderRequest.Builder()
            .Order(order)
            .FieldsToClear(itemsToRemove)
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
        else
        {
          var body = new CreateOrderRequest.Builder()
            .Order(order)
            .IdempotencyKey(Guid.NewGuid().ToString())
            .Build();

          try
          {
            var result = await _client.OrdersApi.CreateOrderAsync(body);
            return new OkObjectResult(result.Order);
          }
          catch (ApiException ex)
          {
            return new BadRequestObjectResult(ex.Errors);
          }
        }
      }
      log.LogInformation($"Failed to update order.");
      return new NotFoundResult();
    }
  }
}
