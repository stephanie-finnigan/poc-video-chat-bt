using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using OpenTokSDK;

namespace BT_VideoChatPOC.Controllers
{
    public class SessionController : Controller
    {
        private IConfiguration _Configuration;
        public SessionController(IConfiguration config)
        {
            _Configuration = config;
        }

        [HttpPost]
        public IActionResult GetSession([FromBody]RoomForm roomForm)
        {
            var apiKey = int.Parse(_Configuration["ApiKey"]);
            var apiSecret = _Configuration["ApiSecret"];
            var connectionString = _Configuration.GetConnectionString("DefaultConnection");
            var opentok = new OpenTok(apiKey, apiSecret);
            var roomName = roomForm.RoomName;
            string sessionId;
            string token;
            using (var db = new OpentokContext(connectionString))
            {
                var room = db.Rooms.Where(r => r.RoomName == roomName).FirstOrDefault();
                if (room != null)
                {
                    sessionId = room.SessionId;
                    token = opentok.GenerateToken(sessionId);
                    room.Token = token;
                    db.SaveChanges();
                }
                else
                {
                    var session = opentok.CreateSession();
                    sessionId = session.Id;
                    token = opentok.GenerateToken(sessionId);
                    var roomInsert = new Room
                    {
                        SessionId = sessionId,
                        Token = token,
                        RoomName = roomName
                    };
                    db.Add(roomInsert);
                    db.SaveChanges();
                }
            }
            return Json(new { sessionId = sessionId, token = token, apiKey = _Configuration["ApiKey"] });
        }

        [HttpGet]
        public IActionResult GetAllMeetings()
        {
            var connectionString = _Configuration.GetConnectionString("DefaultConnection");
            using (var db = new OpentokContext(connectionString))
            {
                var meetings = db.Meetings.ToList();
                return Ok(meetings);
            }
        }

        public class RoomForm
        {
            public string RoomName { get; set; }
        }
    }
}