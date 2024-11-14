# RavelDev.TweetTube.WebUi
Hey :) This was a simple React JS app that interfaces with the pre-X Twitter API to display tweets containing pictures and youtube links. Regretfully, after significant changes to the Twitter API, it has yet to be updated. 

This was my first exposure to React JS and just a way to play around with the framework. Since this was a quick hobbyist project, I opted for the .NET Web API + React App in one project template. The Web API code is located in the repo root, while the react client app in the ClientApp directory. 

It was built against a .NET Core Web API and utilizes Twitter's 3 Legged OAuth authentication. The OAuth headers are built up the old fashioned way (labrously, using built in HTTP client libraries instead of an easy to use, already built OAuth library) because I just wanted to take a closer peak at what's happening when building up the OAuth HTTP headers.

The project also uses a little bit of SignalR for performing client side UI updates while the Twitter API response data is parsed on the server side.
