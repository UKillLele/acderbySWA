using System;
using System.Text.Json.Serialization;

namespace acderby.Models
{
    public class Position
    {
        public Guid Id { get; set; }
        public PositionType PositionType { get; set; }
    }

    public enum PositionType
    {
        Member,
        CoCaptain,
        Captain,
        BenchCoach,
        HeadCoach
    }
}
