import React, { Component } from 'react';
import { TweetThumbnailYoutube } from './TweetThumbnailYoutube'
import { TweetThumbnailMedia } from './TweetThumbnailMedia'
export class Tweet extends Component {
    static displayName = "";

    constructor(props) {
        super(props);

        this.state = { isYoutubeTweet: this.props.tweet.containsYouTubeLink, youTubeUrl: this.props.tweet.youTubeData?.youtubeVideoId, mediaHttpsUrl: this.props.tweet.mediaHttpsUrl };
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className={'col-4'} style={{ display: "inline-block" }}>
                {this.state.isYoutubeTweet && <TweetThumbnailYoutube youtubeVideoId={this.props.tweet.youTubeData.youtubeVideoId} />}
                {!this.state.isYoutubeTweet && <TweetThumbnailMedia tweetId={this.state.tweetId} mediaUrl={this.props.tweet.mediaHttpsUrl} />}
             </div>
    );
  }
}
