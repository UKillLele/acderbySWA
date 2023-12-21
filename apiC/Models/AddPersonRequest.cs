using System;
using Microsoft.AspNetCore.Http;

namespace acderby.Models
{
    public class AddPersonRequest
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public IFormFile ImageFile { get; set; }
        public string Positions { get; set; }
    }

    public class PositionRequest
    {
        public Guid TeamId { get; set; }
        public PositionType Type { get; set; }
    }
}
