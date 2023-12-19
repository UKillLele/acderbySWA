namespace acderby.Models
{
    public class AddFulfillmentRequest : Address
    {
        public string DisplayName { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public int Version { get; set; }
        public string OrderId { get; set; }
        public string Fulfillment { get; set; }
        public string FulfillmentUid { get; set; }
    }
}
