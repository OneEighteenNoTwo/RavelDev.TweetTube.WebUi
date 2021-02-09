import React, { Component } from 'react';
import './Tweets.css';
import { Twitter } from 'react-bootstrap-icons';
export class TweetThumbnailMedia extends Component {
    static displayName = "";

    //usless constructor, thanks ESLint
    constructor(props) {
        super(props);
    }

    async componentDidMount() {

    }

    getTweetYoutubeVideoId() {

        
    }

    onMediaClick = (event) => {
        this.props.tweet.mediaHttpsUrl = this.props.mediaUrl;
        this.props.onClick(event, this.props.tweet);
    };
    onThumbnailMouseLeave = (event) => {
        //const overlayTarget = event.target.parentElement;
        //const youtubeIcon = overlayTarget.querySelector('.thumbnailOverlayIcon');
        //youtubeIcon.classList.add('d-none');
        //overlayTarget.classList.remove('tweet-thumbnail-overlay');
    }
    onThumbnailMouseEnter = (event) => {
        //const overlayTarget = event.target.parentElement;
        //const youtubeIcon = overlayTarget.querySelector('.thumbnailOverlayIcon');
        //youtubeIcon.classList.remove('d-none');
        //overlayTarget.classList.add('tweet-thumbnail-overlay');
    }
    render() {
        return (
            <div className="col-6 col-sm-4 d-flex align-items-center justify-content-center"  onClick={this.onMediaClick}>
                <img
                    onMouseEnter={this.onThumbnailMouseEnter}
                    onMouseLeave={this.onThumbnailMouseLeave}
                    alt={`${this.props.tweet.tweetText.substr(0, 20)}......`}
                    id={this.props.tweet.TweetId}
                    className="img-fluid"
                    src={this.props.mediaUrl}
                    key={this.props.tweet.mediaHttpsUrl}
                />

                <div className="thumbnailOverlayIcon d-none position-absolute">
                    <Twitter size={35} color={'#1DA1F2'} />
                </div>
             </div>
        );
  }
}
