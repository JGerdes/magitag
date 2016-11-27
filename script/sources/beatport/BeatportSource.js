class BeatportSource {

    constructor() {
        this._parser = new BeatportParser();
    }


    requestTags(artist, title, onSuccess) {
        let url = this._createSearchUrl(artist, title);
        this._getTrackData(url, onSuccess);
    }

    _getTrackData(url, onSuccess) {
        //todo load data and parse it with parser
        console.log(url);
        let self = this;
        Network.get(url, function (searchHtml) {
            let trackData = self._parser.parseSearchResultPage(searchHtml);
            let releaseUrl = self._createReleaseUrl(trackData.release);
            Network.get(releaseUrl, function (releaseHtml) {
                let trackUrl = self._createTrackUrl(trackData);
                let releaseData = self._parser.parseReleasePage(releaseHtml, trackUrl);
                trackData.trackId = releaseData.trackId;
                trackData.totalTracks = releaseData.totalTracks;
                trackData.catalogNumber = releaseData.catalog;
                onSuccess(trackData);
            });
        });
    }

    _createSearchUrl(artist, title) {
        let query = artist + "+" + title;
        query = query.replace(/ /g, '+');
        query = query.replace(/\(/g, '');
        query = query.replace(/\)/g, '');
        return "http://classic.beatport.com/search?query=" + query;
    }

    _createReleaseUrl(releaseData) {
        return 'http://classic.beatport.com/release/' + releaseData.slug + '/' + releaseData.id;
    }

    _createTrackUrl(trackData) {
        return 'http://classic.beatport.com/track/' + trackData.slug + '/' + trackData.id;
    }


}