using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace acderby.Models
{
    public class Bout
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public Team HomeTeam { get; set; }
        public int HomeTeamScore { get; set; }
        public Person HomeTeamMVPJammer { get; set; }
        public Person HomeTeamMVPBlocker { get; set; }
        public Team AwayTeam { get; set; }
        public int AwayTeamScore { get; set; }
        public Person AwayTeamMVPJammer { get; set; }
        public Guid AwayTeamMVPBlockerId { get; set; }
        public Person AwayTeamMVPBlocker { get; set; }
        public Uri ImageUrl { get; set; }
    }
}
