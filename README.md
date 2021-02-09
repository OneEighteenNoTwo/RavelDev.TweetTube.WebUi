# RavelDev.TweetTube.WebUi
Hey :) This is a simple React JS app that interfaces with the Twitter API to display tweets containing media. It's built against a .NET Core Web API and utilizes 
Twitter's 3 Legged OAuth authentication to allow users to see a collection of various media they have liked on Twitter. 

The OAuth headers are built up the old fashioned way (labrously, using built in HTTP client libraries instead of an easy to use, already built OAuth library) because I just wanted to take a closer peak at what's happening when building up the OAuth HTTP headers.

The project also uses a little bit of Signal R for performing some client side UI updates while the Twitter API response data is parsed on the server side.

You can see a live version hosted @ https://tweets.postmeta.org



