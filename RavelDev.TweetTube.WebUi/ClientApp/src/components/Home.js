import React, { Component } from 'react';
import { Tweet } from './Tweets/Tweet'
import environment from "../environment/environment"

export class Home extends Component {
    static displayName = Home.name;
    youtubeRegEx = new RegExp('(http(s|):|)\/\/(www\.|)yout(.*?)\/(embed\/|watch.*?v=|)([a-z_A-Z0-9\-]{11})');

    constructor(props) {
        super(props);
        this.state = { oauthToken: '', authorized: false, likedTweets: [] };
    }

    async componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const authParam = urlParams.get('authorized');

        const oauthToken = await fetch(`${environment.apiBase}/GetOAuthAccessToken`).then((response) => {
            return response.text();
        });
        this.setState({ oauthToken: oauthToken });
        const twitterAuthBtn = document.getElementById('twitterAuthButton');
        twitterAuthBtn.classList.remove('disabled');

    }

    render() {
        return (
                <div class="jumbotron">
                    <h1 class="display-4">Module No. 87  </h1>
                    <p class="lead">
                        Hello! Hola! :) This is a program I have created that collects and displays tweets you have liked or posted that contain pictures or Youtube links. 
                    </p>
                    <p class="lead font-weight-bold">
                        This site does not save, persist, or do anything untoward with any of your data. All data retrieved is stored locally on your end and expires in 15 minutes. 
                    </p>
                    <p class="lead">
                        If there's any functionality you would like to see added, please contact our head of Research and Development @  <a href="mailto:TheRavelDevelopment@gmail.com">TheRavelDevelopment@gmail.com</a>.
                     </p>
                    <hr class="my-4"/>
                        <p class="lead">
                    <a id="twitterAuthButton" className="btn btn-primary btn-lg disabled" href={`https://api.twitter.com/oauth/authorize?` + this.state.oauthToken} role="button">
                        Grant Access to All of Your Tweets to a Cold and Calculating Machine  
                        </a>
                        </p>
                </div>

    );
  }
}
