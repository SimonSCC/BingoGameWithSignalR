using Microsoft.AspNetCore.Mvc;
using SignalRBingoWeb.Models;
using SignalRBingoWeb.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRBingoWeb.Controllers
{
    public class GameController : Controller
    {
        public IActionResult Index(User loggedinas)
        {
            return View("GameScreen", new GameViewModel(loggedinas));
        }
    }
}
