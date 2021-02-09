import React, { Component } from 'react';
import './Tweets.css';

export class TweetUserThumb extends Component {
    static displayName = "";

    //usless constructor, thanks ESLint
    constructor(props) {
        super(props);
    }

    async componentDidMount() {

    }

    getTweetYoutubeVideoId() {


    }

    onUserClick = (event) => {
        this.props.onClick(event, this.props.screenName, this.props.profileUrl);
    };

    render() {
        return (
            <div className={`col-6 col-sm-4 cursor-pointer user-nav-thumbnail text-center`} onClick={this.onUserClick}>
                <img alt="a scene that cannot be descrbied"
                    className="profileImage img-fluid"
                    src={this.props.profileUrl}
                />
                <span className="d-block">{this.props.screenName}</span>
                <span className="d-block"><sup className="tweet-user-nav-sub">{this.props.totalTweets} Tweets</sup></span>
            </div>
        );
    }
}
