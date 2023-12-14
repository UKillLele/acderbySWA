
using System;
using System.Collections.Generic;

namespace acderby.Models
{
    public class Team
    {
        public Guid Id { get; set; }
        public string Slug { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Position> Positions { get; set; }
        public Uri ImageUrl { get; set; }
        public Uri LogoUrl { get; set; }
        public string Color { get; set; }
        public int SeasonWins { get; set; }
        public int SeasonLosses { get; set; }
        public int Ranking { get; set; }
        public Uri DefaultSkaterImage { get; set; }
    }
}
