using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using acderby.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using Square.Models;
using Square;
using System.IO;
using System.Net.Mime;
using MimeKit;
using QRCoder;
using Square.Exceptions;
using System.Text;
using System.Text.RegularExpressions;
using MailKit.Security;
using System.Net.Mail;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace ACDerby.Functions
{
  public static class ProcessPayment
  {
    [FunctionName("ProcessPayment")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "process-payment")] HttpRequest req,
        ILogger log)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");
      string requestBody = string.Empty;
      using (StreamReader streamReader = new(req.Body))
      {
        requestBody = await streamReader.ReadToEndAsync();
      }
      PaymentRequest request = JsonConvert.DeserializeObject<PaymentRequest>(requestBody);

      if (request != null)
      {
        SquareClient _client = new SquareClient
                .Builder()
                .Environment(Square.Environment.Production)
                .AccessToken(System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_SquareAccessToken"))
                .Build();
        var uuid = Guid.NewGuid().ToString();
        var createPaymentRequest = new CreatePaymentRequest.Builder(
            sourceId: request.SourceId,
            idempotencyKey: uuid)
            .OrderId(request.Order?.Id)
            .AmountMoney(request.Order?.NetAmountDueMoney)
            .Build();

        try
        {
          var response = _client.PaymentsApi.CreatePayment(createPaymentRequest);
          var fulfillment = request.Order?.Fulfillments[0].Type == "PICKUP" ? request.Order.Fulfillments[0].PickupDetails.Recipient : request.Order?.Fulfillments[0].ShipmentDetails.Recipient;
          if (fulfillment != null)
          {
            QRCodeGenerator qrGenerator = new();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(request.Order?.Id, QRCodeGenerator.ECCLevel.Q);
            BitmapByteQRCode qrCode = new(qrCodeData);
            byte[] qrCodeAsByteArr = qrCode.GetGraphic(20);
            using var ms = new MemoryStream(qrCodeAsByteArr);
            var image = new LinkedResource(ms, MediaTypeNames.Image.Jpeg)
            {
              ContentId = "QRCode.jpeg",
              TransferEncoding = TransferEncoding.Base64,
              ContentLink = new Uri("cid:" + "QRCode.jpeg")
            };
            image.ContentType.Name = image.ContentId;

            string items = string.Empty;
            if (request.Order != null)
            {
              foreach (var item in request.Order.LineItems)
              {
                items += $"<li>{item.Name} x {item.Quantity} @ ${item.BasePriceMoney.Amount / 100}</li>";
              }
            }
            var emailTop = "<!DOCTYPE html><html><head><meta charset='utf-8' /><title></title></head><body><div style='padding: 10px'>";
            var thanks = "<p>Thank you for supporting ACRD! Here's your order info:</p>";
            var emailBottom = "<p>Sincerly,</p><p>UKillLele</p></div></body></html>";
            var template = emailTop;
            template += $"<p>{fulfillment.DisplayName},</p>";
            template += thanks;
            template += $"<ul>{items}</ul>";
            template += request.Order?.TotalDiscountMoney != null && request.Order.TotalDiscountMoney.Amount > 0 ? $"<p>Discounts: ${request.Order?.TotalDiscountMoney.Amount / 100}</p>" : string.Empty;
            template += request.Order?.TotalServiceChargeMoney != null && request.Order.TotalServiceChargeMoney.Amount > 0 ? $"<p>Shipping: ${request.Order?.TotalServiceChargeMoney.Amount / 100}</p>" : string.Empty;
            template += $"<p style='font-weight: bold'>Total: ${request.Order?.TotalMoney.Amount / 100}</p>";
            template += $"<p>order #: {request.Order?.Id}</p>";
            template += "<img src='cid:QRCode.jpeg' height='300' width='300' alt='QRCode.jpeg' />";
            template += emailBottom;

            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(template, Encoding.UTF8, MediaTypeNames.Text.Html);
            htmlView.LinkedResources.Add(image);
            AlternateView plainView = AlternateView.CreateAlternateViewFromString(Regex.Replace(template, "<[^>]+?>", string.Empty), Encoding.UTF8, MediaTypeNames.Text.Plain);
            plainView.LinkedResources.Add(image);

            var message = new MailMessage("info@acderby.com", fulfillment.EmailAddress)
            {
              IsBodyHtml = true,
              DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure,
              Subject = "Assassination City Roller Derby Purchase Receipt",
            };
            message.AlternateViews.Add(plainView);
            message.AlternateViews.Add(htmlView);

            try
            {
              using var client = new MailKit.Net.Smtp.SmtpClient();
              client.Connect(System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_MailServer"), int.Parse(System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_MailPort")), SecureSocketOptions.SslOnConnect);
              client.Authenticate(System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_EmailUserName"), System.Environment.GetEnvironmentVariable("CUSTOMCONNSTR_EmailPassword"));
              client.Send(MimeMessage.CreateFromMailMessage(message));
            }
            catch (Exception ex)
            {
              Console.WriteLine(ex.ToString());
            }
          }
          return new JsonResult(new { payment = response.Payment });
        }
        catch (ApiException e)
        {
          return new JsonResult(new { errors = e.Errors });
        }
      }
      log.LogInformation($"Failed to process payment.");
      return new NotFoundResult();
    }
  }
}
