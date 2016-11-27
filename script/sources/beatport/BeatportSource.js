class BeatportSource {

    constructor() {
        this._parser = new BeatportParser();
    }


    requestTags(artist, title, onSuccess) {
        let url = this._getSearchURL(artist, title);
        //this._getTrackData(url, onSuccess);
        onSuccess({
            id: 1234,
            name: 'name',
            title: 'name (mixName)',
            label: {
                name: 'labelName'
            },
            release: {
                id: 123,
                name: 'releaseName'
            },
            releaseDate: '2016-11-27',
            catalogNumber: 'ABC012',
            artists: [
                {
                    name: 'artistName',
                    type: 'artist'
                }
            ],
            mixName: 'mixName',
            genres: [
                {
                    name: 'genre'
                }
            ],
            bpm: 123,
            key: {
                standard: {
                    letter: 'A',
                    sharp: false,
                    flat: false,
                    chord: 'major'
                }
            },
            trackId: 1,
            totalTracks: 2,
            dynamicImages: {
                main: {
                    url: '//url/to/image{hq}/{w}x{h}/image.jpg'
                }
            }

        });
    }

    _getTrackData(url, onSuccess) {
        //todo load data and parse it with parser
        console.log(url);
        let self = this;
        Network.get(url, function (htmlData) {
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


}