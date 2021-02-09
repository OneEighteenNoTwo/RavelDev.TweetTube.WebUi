using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RavelDev.Twitter.Core.Interfaces;
using RavelDev.Twitter.Interfaces;
using System;
using System.Threading.Tasks;
using System.Web;

namespace RavelDev.TweetTube.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TweetController : ControllerBase
    {

        public TweetController(ITwitterModelApi twitterApi, ITwitterWebApi twitterWebApi)
        {
            this.TwitterApi = twitterApi;
            this.TwitterWebApi = twitterWebApi;
        }

        public ITwitterModelApi TwitterApi { get; }
        public ITwitterWebApi TwitterWebApi { get; }

        [HttpGet]
        [Route("TwitterAuthCallback")]
        public async Task<IActionResult> TwitterAuthCallback()
        {
            try
            {
                var request = this.Request;
                string oAuthToken = Request.Query["oauth_token"].ToString();
                string oAuthVerifier = Request.Query["oauth_verifier"].ToString();


                string token = await this.TwitterWebApi.GetTokenForCallback(oAuthToken, oAuthVerifier);
                var queryParams = HttpUtility.ParseQueryString(token);

                var oauthToken = queryParams["oauth_token"].ToString();
                var oauthTokenSecret = queryParams["oauth_token_secret"].ToString();
                var screenName = queryParams["screen_name"].ToString();
                var userId = queryParams["user_id"].ToString();
                var ip = request.HttpContext.Connection.RemoteIpAddress;
                HttpContext.Session.SetString("OAT", oauthToken);
                HttpContext.Session.SetString("OATS", oauthTokenSecret);
                return Redirect("~/Tweets");
            }
            catch(Exception ex)
            {
                return StatusCode(500);
            }
        }

        [HttpGet]
        [Route("GetOAuthAccessToken")]
        public async Task<IActionResult> GetOAuthAccessToken()
        {
            try
            {
                var oauthToken = await TwitterWebApi.GetUserOAuthRequestToken();
                return Ok(oauthToken);
            }
            catch(Exception ex)
            {
                return StatusCode(500);
            }
        }


        [HttpGet]
        [Route("GetAndParseLikedTweets")]
        public async Task<IActionResult> GetAndParseLikedTweets(string connectionId)
        {
            try
            {
                var oauthToken = HttpContext.Session.GetString("OAT");
                var oauthTokenSecret = HttpContext.Session.GetString("OATS");

                if(string.IsNullOrEmpty(oauthToken) || string.IsNullOrEmpty(oauthTokenSecret))
                {
                    return Redirect("~/");
                }
                var results = await TwitterApi.GetLikedAndPostedMediaTweetsForOAuthToken(
                    oauthToken,
                    oauthTokenSecret, 
                    connectionId);

                return Ok(results);
            }
            catch(Exception ex)
            {
                return Redirect("~/");
            }
        }
    }
}
