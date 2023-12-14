using System;
using System.Collections.Generic;

namespace acderby.Models
{
    public class Person
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public Uri ImageUrl { get; set; }
        public ICollection<Position> Positions { get; set; }
    }
}
