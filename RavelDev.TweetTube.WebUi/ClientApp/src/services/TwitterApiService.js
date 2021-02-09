import environment from "../environment/environment"

export class TwitterApiService {

    constructor() {

    }

    async getTweets(connectionId) {

        try {
            const allUserTwitterData = await fetch(`${environment.apiBase}/GetAndParseLikedTweets?connectionId=${connectionId}`).then((response) => {
                const hey = "ya";
                if (response.redirected) {
                    window.location = response.url;
                }
                else if (response.status === 500) {
                    throw new Error("Error accessing web server");
                }
                return response.json();
            }).then((data) => {
                return data;
            });

            return allUserTwitterData;
        }
        catch (exception) {
            return null;
        }
    }
}