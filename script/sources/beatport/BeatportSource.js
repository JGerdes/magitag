class BeatportSource {

    constructor() {
        this._parser = new BeatportParser();
    }


    requestTags(artist, title, onSuccess) {
        let url = this._createSearchUrl(artist, title);
        this._getTrackData(url, onSuccess);
    }

    _getTrackData(url, onSuccess) {
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
                self._postProcessData(trackData, onSuccess);
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


    _postProcessData(data, onSuccess) {
        let tag = new Tag();

        tag.title = data.name;
        tag.label = data.label.name;
        tag.releaseName = data.release.name;
        tag.year = new Date(data.releaseDate).getYear() + 1900;
        tag.trackNumber = data.trackId;
        tag.totalTracks = data.totalTracks;
        tag.bpm = data.bpm;
        tag.key = this._assembleKey(data.key);
        tag.mixName = data.mixName;
        tag.catalogNumber = data.catalogNumber;
        tag.beatportId = data.id;
        tag.beatportReleaseId = data.release.id;
        tag.genres = [];
        for (let i = 0; i < data.genres.length; i++) {
            tag.genres.push(data.genres[0].name);
        }
        tag.artists = [];
        for (let i = 0; i < data.artists.length; i++) {
            if (data.artists[i].type === 'artist') {
                tag.artists.push(data.artists[i].name);
            }
            if (data.artists[i].type === 'remixer') {
                tag.mixArtist = data.artists[i].name;
            }
        }

        let coverUrl = 'http:' + data.dynamicImages.main.url;
        coverUrl = coverUrl.replace('{hq}', '_hq')
            .replace('{w}', '1024')
            .replace('{h}', '1024');

        Network.getAsArrayBuffer(coverUrl, function (cover) {
            tag.cover = cover;
            onSuccess(tag);
        });
    }

    _assembleKey(key) {
        let keyString = key.standard.letter;
        if (key.standard.flat) {
            keyString += 'b';
        }
        if (key.standard.sharp) {
            keyString += '#';
        }
        if (key.standard.chord === 'minor') {
            keyString += 'm';
        }
        return keyString;
    }
}