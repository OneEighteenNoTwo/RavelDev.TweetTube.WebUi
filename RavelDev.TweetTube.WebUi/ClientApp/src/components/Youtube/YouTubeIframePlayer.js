import React, { Component } from 'react';

export class YouTubeIframePlayer extends Component {
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

    render() {
        return (
            <div className='row d-none mt-3' id="youtubeContainer">
                <div className="col-12 text-center" >
                    <span className="d-block font-weight-bold">A hand crafted artisan playlist created from all the Youtube links you've posted or liked on Twitter.</span>
                </div>
               <div className="col-12 d-lesser-flex align-items-center justify-content-center mt-n20" >
                    <div className="mx-auto mt-5" id={`player`} />
                </div>
            </div>
        );
  }
}
