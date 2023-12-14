using System;

namespace acderby.Models
{
    public class UpdatePersonRequest : AddPersonRequest
    {
        public Guid Id { get; set; }
    }
}
