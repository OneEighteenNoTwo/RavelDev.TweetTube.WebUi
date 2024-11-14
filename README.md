# RavelDev.TweetTube.WebUi
Hey :) This was a simple React JS app that interfaces with the Twitter API pre X days to display tweets containing media. Regretfully, after significant changes to the Twitter API, it has yet to be updated. 

It was built against a .NET Core Web API and utilizes Twitter's 3 Legged OAuth authentication to allow users to see a collection of various media they have liked on Twitter. 

The OAuth headers are built up the old fashioned way (labrously, using built in HTTP client libraries instead of an easy to use, already built OAuth library) because I just wanted to take a closer peak at what's happening when building up the OAuth HTTP headers.

The project also uses a little bit of SignalR for performing client side UI updates while the Twitter API response data is parsed on the server side.


