import React, { Component } from 'react';
import {  Youtube } from 'react-bootstrap-icons';
export class TweetThumbnailYoutube extends Component {
    static displayName = "";
    //usless constructor, thanks ESLint
    constructor(props) {
        super(props);
    }

    async componentDidMount() {

    }


    getTweetYoutubeVideoId() {

        
    }
    handleYoutubeThumbImgMouseLeave = (event) => {

    }
    handleYoutubeThumbImgHover = (event) => {

    }

    
    onYoutubeClick = (event) => {
        this.props.onClick(event, this.props.tweet);
    };
    render() {
        return (
            <div className="col-6 col-sm-4 d-flex align-items-center justify-content-center" onClick={this.onYoutubeClick}>
                <img onMouseEnter={this.handleYoutubeThumbImgHover}
                    onMouseLeave={this.handleYoutubeThumbImgMouseLeave}
                    className="tweetYoutubeThumbnail img-fluid"
                    src={`https://img.youtube.com/vi/${this.props.youtubeVideoId}/hqdefault.jpg`} alt="" />
                <div className="youtubeOverlayIcon position-absolute">
                    <Youtube size={35} color={'#FF0000'}/>
                </div>
            </div>
        );
  }
}
