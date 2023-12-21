using Square.Models;

namespace acderby.Models
{
    public class PaymentRequest
    {
        public string SourceId { get; set; }
        public Order Order { get; set; }
    }
}
