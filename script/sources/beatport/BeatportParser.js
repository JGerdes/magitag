class BeatportParser {

    constructor() {
        this._parser = new DOMParser();
    }

    parseSearchResultPage(htmlString) {
        let dom = this._parser.parseFromString(htmlString, "text/html");
        let rawJson = dom.querySelectorAll('[data-json]')[0].getAttribute('data-json');
        return JSON.parse(rawJson);
    }

    parseReleasePage(htmlString, trackUrl) {
        let result = {};
        let dom = this._parser.parseFromString(htmlString, "text/html");
        result.trackId = dom.querySelectorAll('a[href="' + trackUrl + '"]')[0]
            .parentNode.parentNode.getAttribute('data-index');
        let totalTracksText
            = dom.querySelectorAll('#body>div.release-detail>div.lastUnit>div.track-grid-total-row.fontCondensed')[0]
            .innerHTML;
        result.totalTracks = /^\s*(\d+)/.exec(totalTracksText)[1];
        result.catalog = dom.querySelectorAll('.meta-data tr:last-child>td.meta-data-value')[0].innerHTML;

        return result;
    }
}