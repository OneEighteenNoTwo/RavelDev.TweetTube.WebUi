import React, { Component } from 'react';
import { TweetThumbnailMedia } from './TweetThumbnailMedia'
import { TweetThumbnailYoutube } from './TweetThumbnailYoutube'
export class TweetDisplayView extends Component {
    static displayName = "";

    constructor(props) {
        super(props);

    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="row">
                {this.props.tweets && this.props.tweets.map((tweet, index) => {

                    if (tweet.containsYouTubeLink) {
                        return (
                            <TweetThumbnailYoutube onClick={this.props.onYoutubeClick} youtubeVideoId={tweet.youTubeData.youtubeVideoId} tweet={tweet} />
                        ) 
                    }
                    return (tweet.tweetMedia.map((tweetMedia, indexDos) => {
                        return (
                            <TweetThumbnailMedia onClick={this.props.onMediaClick} tweet={tweet} mediaUrl={tweetMedia} />
                        )
                    }))
                })}
            </div>
        )
    }
    
}
