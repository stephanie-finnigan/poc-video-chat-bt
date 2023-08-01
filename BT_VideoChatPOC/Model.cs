using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BT_VideoChatPOC
{
    public class OpentokContext : DbContext
    {
        public OpentokContext(DbContextOptions<OpentokContext> options)
            : base(options)
        { }

        public OpentokContext(string connectionString) : base() { _connectionString = connectionString; }

        private string _connectionString;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_connectionString);
            }
        }

        public DbSet<Meeting> Meetings { get; set; }
        public DbSet<Room> Rooms { get; set; }
    }

    public class Meeting
    {
        public int MeetingId { get; set; }
        public string MeetingCode { get; set; }
        public DateTime StartTime { get; set; }
        public int Duration { get; set; }
    }

    public class Room
    {
        public int RoomId { get; set; }
        public string SessionId { get; set; }
        public string RoomName { get; set; }
        public string Token { get; set; }
    }

    public class Archive
    {
        public Guid ArchiveId { get; set; }
        public int SessionId { get; set; }
        public string Name { get; set; }
        public bool HasAudio { get; set; }
        public bool HasVideo { get; set; }
        public string OutputMode { get; set; }
    }
}
