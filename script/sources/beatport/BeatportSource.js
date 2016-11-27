class BeatportSource {

    constructor() {
        this._parser = new BeatportParser();
    }


    requestTags(artist, title, onSuccess) {
        let url = this._getSearchURL(artist, title);
        this._getTrackData(url, onSuccess);
    }

    _getTrackData(url, onSuccess) {
        //todo load data and parse it with parser
        console.log(url);
        let self = this;
        this._loadURL(url, function (htmlData) {
            let parser = new DOMParser();
            let dom = parser.parseFromString(htmlData, "text/html");
            console.log(dom);
            let rawJson = dom.querySelectorAll('[data-json]')[0].getAttribute('data-json');
            let json = JSON.parse(rawJson);
            console.log('got data', json);
            let releaseUrl = 'http://classic.beatport.com/release/' + json.release.slug + '/' + json.release.id;
            let trackUrl = 'http://classic.beatport.com/track/' + json.slug + '/' + json.id;
            self._loadURL(releaseUrl, function (htmlData) {
                dom = parser.parseFromString(htmlData, "text/html");
                let trackId = dom.querySelectorAll('a[href="' + trackUrl + '"]')[0].parentNode.parentNode
                    .getAttribute('data-index');
                let totalTracksText = dom.querySelectorAll('#body>div.release-detail>div.lastUnit>div.track-grid-total-row.fontCondensed')[0].innerHTML;
                let totalTracks = /^\s*(\d+)/.exec(totalTracksText)[1];
                let catalog = dom.querySelectorAll('.meta-data tr:last-child>td.meta-data-value')[0].innerHTML;

                json.trackId = trackId;
                json.totalTracks = totalTracks;
                json.catalogNumber = catalog;
                onSuccess(json);
            });
        });
    }

    _getSearchURL(artist, title) {
        //todo: implement
        let query = artist + "+" + title;
        query = query.replace(/ /g, '+');
        query = query.replace(/\(/g, '');
        query = query.replace(/\)/g, '');
        return "http://classic.beatport.com/search?query=" + query;
    }

    _loadURL(url, callback) {
        var d = new XMLHttpRequest;
        d.addEventListener("load", function (a) {
            callback(a.target.responseText)
        });
        d.open("GET", url);
        d.send();
    }

}