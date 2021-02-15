const localHostBase = "https://localhost:44301";
const productionBase = "https://tweets.postmeta.org"
const isProduction = true;

const urls = {
    getTweets: "/api/tweet",
    signalRHub: "/hubs/tweetupdates"
}
const environmentSettings = {
    apiBase: isProduction ? `${productionBase}${urls.getTweets}` : `${localHostBase}${urls.getTweets}`,
    signlarRBase: isProduction ? `${productionBase}${urls.signalRHub}` : `${localHostBase}${urls.signalRHub}`
};


export { environmentSettings as default }