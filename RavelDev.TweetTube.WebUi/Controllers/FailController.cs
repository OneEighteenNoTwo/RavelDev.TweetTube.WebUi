using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RavelDev.Twitter.Interfaces;
using System;
using System.Threading.Tasks;
using System.Web;

namespace RavelDev.TweetTube.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FailController : ControllerBase
    {

        [HttpGet]
        [Route("Index")]
        public async Task<IActionResult> Index()
        {
            try
            {
                return Redirect("~/NothingThatExists");
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

    }
}
