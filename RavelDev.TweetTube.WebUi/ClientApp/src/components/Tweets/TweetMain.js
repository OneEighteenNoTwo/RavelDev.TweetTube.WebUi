import React, { Component } from 'react';
import { TwitterApiService } from '../../services/TwitterApiService'
import { TweetUserThumb } from './TweetUserThumb'
import { TweetDisplayView } from './TweetDisplayView'
import { YouTubeIframePlayer } from '../Youtube/YouTubeIframePlayer'
import environment from "../../environment/environment"
import { GenericSpinner, LoadTweetsSpinner } from "../Ui/Spinners"
import { HubConnectionBuilder } from '@microsoft/signalr';
import Modal from 'react-bootstrap/Modal'
import { ArrowDown, ArrowUp, Images, People, Twitter, X, Youtube } from 'react-bootstrap-icons';
import TwitterConstants from './Constants';
import SignalRConstants from '../SignalR/Constants';
export class TweetMain extends Component {
    static displayName = TweetMain.name;

    displayYoutubePlayer(displayPlayer) {
        const player = document.getElementById('youtubeContainer');
        if (displayPlayer) {
            player.classList.remove("d-none");
        }
        else {
            player.classList.add("d-none");
        }
    }

    updateTweetsForDisplay(selectedValue) {
        let tweets = this.state.currentlyDisplayedTweets;
        let displayPlayer = false;
        if (selectedValue === TwitterConstants.YOUTUBE_SELECTED) {
            tweets = this.state.allTweets.filter(tweet => tweet.containsYouTubeLink);
            displayPlayer = true;
        }
        else if (selectedValue === TwitterConstants.PHOTOS_SELECTED) {
            displayPlayer = false;
            tweets = this.state.allTweets.filter(tweet => tweet.hasPhotos);
        }

        this.displayYoutubePlayer(displayPlayer);
        window.scrollTo(0, 0);
        this.setState({
            currentPage: 2,
            totalTweets: tweets.length,
            currentTweetDisplay: selectedValue,
            currentlyDisplayedTweets: tweets.slice(0, this.state.resultsPerPage),
            currentTweetsFilter: tweets,
            viewByUser: false
        });
    }
    setupSignalR() {
        const connection = new HubConnectionBuilder()
            .withUrl(environment.signlarRBase)
            .withAutomaticReconnect()
            .build();
        let connectionId = 0;
        connection.start()
            .then(result => {
                connection.on(SignalRConstants.TWEET_PARSE_UPDATE_MSG, message => {
                    this.setState({ currentTweet: message.currentTweet, totalTweets: message.totalTweets });
                });
                connection.on(SignalRConstants.API_RESPONSE_RECEIVED_MSG, message => {
                    this.setState({ apiResponseRecieved: true });
                });
            })
            .then((result) => {
                connectionId = connection.connectionId;
                this.getTweetData(connectionId);
            })
            .catch((e) => {
                console.log('Connection failed: ', e);
                this.getTweetData('')
            }
            );
    }


    scrollPageChange() {
        const ignoreInfiniteScroll = this.state.currentTweetDisplay === TwitterConstants.USERS_SELECTED && this.state.showingTweetsFromUser === false;
        if (ignoreInfiniteScroll) return;

        const pageLimit = this.state.resultsPerPage;
        const currentPage = this.state.currentPage + 1;
        const offset = (currentPage - 1) * pageLimit;
        if (this.state.currentTweetsFilter.len < offset) return;
        const newTweetsToDisplay = this.state.currentTweetsFilter.slice(offset, offset + pageLimit);

        this.setState({
            currentPage: currentPage,
            currentlyDisplayedTweets: this.state.currentlyDisplayedTweets.concat(newTweetsToDisplay),
        });
    }

    bindInfiniteScroll(enable) {
        window.addEventListener('scroll', () => {
            const {
                scrollTop,
                scrollHeight,
                clientHeight
            } = document.documentElement;

            const oneValue = scrollTop + clientHeight;
            const another = scrollHeight - 5;
            const changePage = (oneValue >= another - 90);
            if (changePage) {
                this.scrollPageChange();
            }
        }, {
            passive: true
        });
    }
    constructor(props) {
        super(props);
        this.playerReady = false;
        this.bindInfiniteScroll(true);
        this.twitterService = new TwitterApiService();
        this.state = {
            showMediaModal: false,
            modalImgUrl: '',
            currentPage: 1,
            currentlyDisplayedTweets: [],
            loadingTweets: true,
            currentTweet: 0,
            totalTweets: 0,
            screenNameToUserData: [],
            currentDisplayedTweets: [],
            currentTweetDisplay: TwitterConstants.YOUTUBE_SELECTED,
            usersPerPage: 12,
            showingTweetsFromUser: false,
            viewByUser: false,
            resultsPerPage: 18
        };
        this.setupSignalR();
    }
    setLocalStoarge(tweetData) {
        var d1 = new Date(),
            d2 = new Date(d1);
        d2.setMinutes(d1.getMinutes() + 10);
        localStorage.setItem(TwitterConstants.USER_TWEET_DATE_STORAGE_KEY, JSON.stringify(d2))
        localStorage.setItem(TwitterConstants.USER_TWEET_DATA_STORAGE_KEY, JSON.stringify(tweetData));
    }

    checkLocalStorageExpiration() {
        let tweetDate = null;
        try {
            tweetDate = new Date(JSON.parse(localStorage.getItem(TwitterConstants.USER_TWEET_DATE_STORAGE_KEY)));
        }
        catch (Exception) {

        }

        const currentDate = new Date();

        if (tweetDate < currentDate || !tweetDate) {
            localStorage.removeItem(TwitterConstants.USER_TWEET_DATA_STORAGE_KEY)
        }
    }

    async getTweetData(connectionId) {
        let allUserTwitterData;
        this.checkLocalStorageExpiration();
        const dataStorage = localStorage.getItem(TwitterConstants.USER_TWEET_DATA_STORAGE_KEY);
        allUserTwitterData = !dataStorage ? null : JSON.parse(dataStorage);
        const needToRetrieveTwitterApiData = (!allUserTwitterData || !allUserTwitterData.tweets) || allUserTwitterData.tweets.length < 1 || !Array.isArray(allUserTwitterData.tweets);
        if (needToRetrieveTwitterApiData) {
            this.setState({
                preLoadingMessage: 'Asking the Twitter Gods for Your Data.....',
                apiResponseRecieved: false
            });
            try {
                allUserTwitterData = await this.twitterService.getTweets(connectionId);
            }
            catch (exception) {

            }
            this.setLocalStoarge(allUserTwitterData);
        }
        if (!allUserTwitterData) return;
        var tweets = allUserTwitterData.tweets.filter(tweet => tweet.containsYouTubeLink);

        try {
            this.setYoutubePlayerPlaylist(tweets);
        }
        catch (Exception) {

        }

        this.setState({
            currentTweetsFilter: tweets,
            loadingTweets: false,
            currentPage: 1,
            totalTweets: tweets.length,
            allTweets: allUserTwitterData.tweets,
            screenNameToUserData: allUserTwitterData.screenNameToUserData
        });

        this.updateTweetsForDisplay(TwitterConstants.PHOTOS_SELECTED);
    }


    async componentDidMount() {
        this.displayYoutubePlayer(false);
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

            window.onYouTubeIframeAPIReady = this.loadVideo;

            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            this.loadVideo();
        }
    }

    onPlayerReady = event => {
        this.playerReady = true;
        if (this.state.allTweets && this.state.allTweets.length > 0)
            this.setYoutubePlayerPlaylist(this.state.allTweets.filter(tweet => tweet.containsYouTubeLink));
    };

    loadVideo = () => {
        const self = this;
        window.YT.ready(function () {
            self.player = new window.YT.Player(`player`, {
                events: {
                    onReady: self.onPlayerReady,
                },
            });
        });
    };

    setYoutubePlayerPlaylist(tweets) {
        if (tweets && this.playerReady) {
            var videoIdsCsv = tweets.map(function (value) {
                return `${value.youTubeData.youtubeVideoId}`;
            });
            this.player.cuePlaylist(videoIdsCsv);
        }
    }

    onMediaClick = (event, tweet) => {
        this.setState({ showMediaModal: true, currentModalTweet: tweet });
    };

    onYoutubeClick = (event, tweet) => {
        this.setState({ showMediaModal: true, currentModalTweet: tweet });
    };

    onUserThumbClick = (event, screenName, profileUrl) => {
        const tweetsFromUser = this.state.allTweets.filter(tweet => tweet.tweetAuthor === screenName);
        const tweetsToDisplay = tweetsFromUser.slice(0, this.state.resultsPerPage);
        this.setState({
            currentTweetUser: {
                screenName: screenName, profileUrl: profileUrl
            },
            currentlyDisplayedTweets: tweetsToDisplay,
            currentTweetsFilter: tweetsFromUser,
            currentPage: 1,
            showingTweetsFromUser: true,

        });
        window.scrollTo(0, 0);

    }

    hideModal = () => {
        this.setState({ showMediaModal: false });
    };

    viewByUserToggle = (toggleValue) => {
        if (!toggleValue) {
            this.updateTweetsForDisplay(TwitterConstants.PHOTOS_SELECTED);
            this.setState({
                showingTweetsFromUser: false,
                viewByUser: false
            })
            return;
        }
        const usersToDisplay = this.state.screenNameToUserData.slice(0, this.state.usersPerPage)
        this.displayYoutubePlayer(false);
        const hasMoreUsers = this.state.usersPerPage < this.state.screenNameToUserData.length;
        this.setState({
            currentlyDisplayedTweets: [],
            viewByUser: toggleValue,
            currentUsersDisplayed: usersToDisplay,
            currentUserPage: 1,
            currentTweetDisplay: TwitterConstants.USERS_SELECTED,
            hasMoreUsers: hasMoreUsers,
            showingTweetsFromUser: false
        })
    }
    userListPrevPageClick = () => {
        if (this.state.currentUserPage <= 1) return;
        const currentPage = this.state.currentUserPage;
        const navigiationToPage = currentPage - 1;
        const startingIndex = ((navigiationToPage - 1) * this.state.usersPerPage);
        const endingIndex = (startingIndex + this.state.usersPerPage);
        const usersToDisplay = this.state.screenNameToUserData.slice(startingIndex, endingIndex);
        this.setState({ viewByUser: true, currentUsersDisplayed: usersToDisplay, currentUserPage: navigiationToPage })
    }
    userListNextPageClick = () => {
        const currentPage = this.state.currentUserPage;
        const navigiationToPage = currentPage + 1;
        const startingIndex = (currentPage * this.state.usersPerPage);
        const endingIndex = (this.state.usersPerPage * navigiationToPage);
        const usersToDisplay = this.state.screenNameToUserData.slice(startingIndex, endingIndex);
        const hasMoreUsers = endingIndex < this.state.screenNameToUserData.length;
        this.setState({ viewByUser: true, currentUsersDisplayed: usersToDisplay, currentUserPage: navigiationToPage, hasMoreUsers: hasMoreUsers })
    }
    render() {
        return (
            <div className="tweetMainContainer">
                {this.state.loadingTweets &&
                    <LoadTweetsSpinner
                        totalTweets={this.state.totalTweets}
                        currentTweet={this.state.currentTweet}
                        preLoadingMessage={this.state.preLoadingMessage}
                        apiResponseRecieved={this.state.apiResponseRecieved}
                    />}

                {(!this.state.loadingTweets) &&
                    <div className="row tweetViewOptionsNav sticky-top bgColorWhite pt-2">
                        <div className="col-4 text-center cursor-pointer" onClick={() => this.viewByUserToggle(true)} >
                            <People size={35} />
                            <span className="tweet-nav-item ml-2">By User</span>
                         </div>
                         <div className="col-4 text-center cursor-pointer" onClick={() => this.updateTweetsForDisplay('photos')}>
                            <Images size={35} />
                            <span className="tweet-nav-item ml-2">Media</span>
                        </div>
                        <div className="col-4 text-center cursor-pointer" onClick={() => this.updateTweetsForDisplay('yt')}>
                            <Youtube size={35} />
                           <span className="tweet-nav-item ml-2">Youtube</span>
                        </div>
                    </div>
                }


                {this.state.viewByUser &&
                    <div className="bgColorWhite">
                        <div class="d-flex justify-content-between bd-highlight mb-3">
                            <div class="p-2 bd-highlight" onClick={this.userListPrevPageClick}>
                            </div>
                        <div className="p-2 bd-highlight" onClick={this.userListPrevPageClick}>
                            {(this.state.currentUserPage === 1 && !this.state.showingTweetsFromUser) &&
                                <span className="font-weight-bold">Choose a User to see photos of theirs that you've liked.</span>}
                            {(this.state.showingTweetsFromUser) &&
                                <div class="user-tweet-selected-container">
                                    <img className="img-fluid" alt="a user profile avatar" src={this.state.currentTweetUser.profileUrl}  />
                                     <span className="ml-4 font-weight-bold user-selected-text">Photos and Youtube links posted by {this.state.currentTweetUser.screenName}</span>
                                </div>}
                            {(this.state.currentUserPage > 1 && !this.state.showingTweetsFromUser) && <ArrowUp size={46} />}
                            </div>
                             <div className="p-2 bd-highlight">
                 
                             </div>
                        </div>
                        <div className="row" id="twitterUserContainer">
                        {!this.state.showingTweetsFromUser && this.state.currentUsersDisplayed.map((userData, index) => {
                                return (
                                    <TweetUserThumb
                                        onClick={this.onUserThumbClick}
                                        totalTweets={userData.totalTweets}
                                        profileUrl={userData.profileUrl}
                                        screenName={userData.screenName} />
                                )})
                            }
                    </div>
          
                    <div class="d-flex justify-content-between bd-highlight mb-3" onClick={this.userListNextPageClick}>
                                <div class="p-2 bd-highlight"></div>
                        <div class="p-2 bd-highlight">
                            {(!this.state.showingTweetsFromUser && this.state.hasMoreUsers) && <ArrowDown size={46} />} 
                        </div>
                                <div class="p-2 bd-highlight"></div>
                        </div>
                    </div>}


                
                    <YouTubeIframePlayer />
                    {this.state.loadingTweetsScroll && <GenericSpinner
                />}
                {(!this.state.loadingTweetsScroll && this.state.currentTweetDisplay === TwitterConstants.PHOTOS_SELECTED) &&
                    <div className="row text-center mb-5">
                        <div className="col-12">
                        <span className="font-weight-bold">Many of the tweets you've posted or liked that have photos or Youtube videos in them!</span>
                        </div>
                    </div>
                    
                    }
                    <Modal
                        {...this.props}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        className="tweet-img-modal"
                        show={this.state.showMediaModal}
                        onHide={this.hideModal}
                    >
                        <Modal.Header>
                            <div class="offset-md-11 col-1">
                            <X size={33} onClick={this.hideModal}/>
                             </div>
                        </Modal.Header>
                        <Modal.Body className="text-center tweet-img-modal-content">
                        {(this.state.currentModalTweet && !this.state.currentModalTweet.containsYouTubeLink) &&
                            <img src={this.state.currentModalTweet.mediaHttpsUrl} alt="something from twitter" className="img-fluid" />}

                        {(this.state.currentModalTweet && this.state.currentModalTweet.containsYouTubeLink) &&
                            <iframe
                            className="youtubeModalIframe img-fluid"
                                title="yo"
                                src={`https://www.youtube.com/embed/${this.state.currentModalTweet.youTubeData.youtubeVideoId}`}
                                frameborder="0"
                                allowfullScreen></iframe>
                        }
                        </Modal.Body>
                    <Modal.Footer>
                        {this.state.currentModalTweet &&
                        <div className="text-center w-100">
                            <p className="d-block">
                                <a className="mr-2" rel="noopener noreferrer" target="_blank" href={`https://twitter.com/${this.state.currentModalTweet.tweetAuthor}/status/${this.state.currentModalTweet.tweetId}`}><Twitter size={55} color={'#1DA1F2'} /></a>
                                <span dangerouslySetInnerHTML={{ __html: this.state.currentModalTweet.tweetText }}></span>
                            </p>
                            <img className="ml-2 img-fluid modal-img-fluid" src={this.state.currentModalTweet.tweetAuthorProfileImage} alt="something from twitter"  />
                            <span className="ml-2">{this.state.currentModalTweet.tweetAuthor}</span>
                            
                        </div>
                        }
                        </Modal.Footer>
                    </Modal>
       
                
                {(this.state.currentlyDisplayedTweets && this.state.currentTweetDisplay !== TwitterConstants.YOUTUBE_SELECTED) &&

                    <TweetDisplayView onMediaClick={this.onMediaClick} onYoutubeClick={this.onYoutubeClick} tweets={this.state.currentlyDisplayedTweets}/>
              }
           </div>

    );
  }
}
