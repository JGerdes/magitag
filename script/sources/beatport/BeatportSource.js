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
        this._loadURL(url, function (htmlData) {
            let parser = new DOMParser();
            let dom = parser.parseFromString(htmlData, "text/html");
            console.log(dom);
            let rawJson = dom.querySelectorAll('[data-json]')[0].getAttribute('data-json');
            let json = JSON.parse(rawJson);
            console.log('got data', json);
            onSuccess(json);
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