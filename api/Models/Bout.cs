using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace acderby.Models
{
    public class Bout
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public Guid? HomeTeam { get; set; }
        public int? HomeTeamScore { get; set; }
        public Guid? HomeTeamMVPJammer { get; set; }
        public Guid? HomeTeamMVPBlocker { get; set; }
        public Guid? AwayTeam { get; set; }
        public int? AwayTeamScore { get; set; }
        public Guid? AwayTeamMVPJammer { get; set; }
        public Guid? AwayTeamMVPBlocker { get; set; }
        public Uri ImageUrl { get; set; }
    }
}
