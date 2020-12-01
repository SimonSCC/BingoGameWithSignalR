using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace SignalRBingoWeb.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {            
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task PlayerReadyUp(string user)
        {
            await Clients.All.SendAsync("PlayerReady", user);
        }

        public async Task NewNumber()
        {            
            await Clients.All.SendAsync("SentNewNumber", GameMethods.NewRandomNumber());
        }

        public async Task ControlBingo(List<string> allColumns, string user)
        {
            await Clients.All.SendAsync("IsBingo?", GameMethods.IsBingo(allColumns), user);
        }

        public async Task ControlRow(List<string> allColumns, string user)
        {
            await Clients.All.SendAsync("IsRow?", GameMethods.IsRow(allColumns), user);
        }

        public async Task NewUser(string user)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "BingoUsers");

            GameMethods.JoinedUsers.Add(user + "-" + Context.ConnectionId);
            await Clients.All.SendAsync("NewUserAdded", user);
        }

        public async Task GetConnectedUsers()
        {
            List<string> usernames = new List<string>();
            foreach (string user in GameMethods.JoinedUsers)
            {
                string[] temp = user.Split("-");
                usernames.Add(temp[0]);
            }

            await Clients.Caller.SendAsync("ListUsers", usernames);
        }

        public async Task UserLeaves(string user)
        {
            GameMethods.JoinedUsers.RemoveAll(u => u.StartsWith(user));

            await Clients.All.SendAsync("RemoveUser", user);
        }

        public async Task Reset()
        {
            GameMethods.MentionedNumbers = new List<int>();
            GameMethods.JoinedUsers = new List<string>();
            await Clients.All.SendAsync("ResetUser");
        }




        //Cat stuff_____________________________________

        public async Task OtherCatMoves(string usercat, string direction)
        {
            await Clients.All.SendAsync("OtherCatMovesDirection", usercat, direction);
        }
       
        public async Task SpawnCat(string usercat)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");
            

            CatTracker.ConnectedCats.Add(usercat + "-" + Context.ConnectionId);
            await Clients.All.SendAsync("SpawnCat", usercat);
        }
        public async Task DeleteCat(string usercat)
        {
            CatTracker.ConnectedCats.RemoveAll(u => u.StartsWith(usercat));

            CatTracker.LocationOfCat.RemoveAll(u => u.StartsWith(usercat));

            await Clients.All.SendAsync("DeleteCat", usercat);
        }

        public async Task CanIHaveListOfConnectedCats(string usercat)
        {
            foreach (string cat in CatTracker.LocationOfCat)
            {
                string[] NameLeftTop = cat.Split("-");
            
                await Clients.Caller.SendAsync("ListConnectedCats", NameLeftTop[0], NameLeftTop[1], NameLeftTop[2]);
            }
        }

        public async Task UpdatePositions(string usercat)
        {
            await Clients.All.SendAsync("TransferPosition");
            
        }
        public async Task UploadPos(string usercat, string left, string top) //Make server only run canihavelistofconnectedcats if this task is complet?
        {
            CatTracker.LocationOfCat.RemoveAll(u => u.StartsWith(usercat));

            CatTracker.LocationOfCat.Add(usercat + "-" + left + "-" + top);         
            
        }



        //For Both
        public override async Task OnDisconnectedAsync(Exception e)
        {
            Console.WriteLine(Context.User);
            Console.WriteLine(Context.ConnectionId);


            string catToRemove = CatTracker.ConnectedCats.Where(u => u.EndsWith(Context.ConnectionId)).FirstOrDefault();
            string username = GameMethods.JoinedUsers.Where(u => u.EndsWith(Context.ConnectionId)).FirstOrDefault();

            if (catToRemove != null)
            {
               string[] UsernameAndConn = catToRemove.Split("-");
               await DeleteCat(UsernameAndConn[0]);
            }
            if (username != null)
            {
                string[] UsernameAndConn = username.Split("-");
                await UserLeaves(UsernameAndConn[0]);
            }

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");//Unsure if needed
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "BingoUsers");//Unsure if needed


            await base.OnDisconnectedAsync(e);
        }

      

      
    }
}
