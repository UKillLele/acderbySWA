using System;

namespace acderby.Models
{
    public class Sponsor
    {
        public Guid Id { get; set; }
        public SponsorshipLevel Level { get; set; }
        public Uri LogoUrl { get; set; }
    }
}
