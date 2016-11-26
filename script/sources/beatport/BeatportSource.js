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
        let data = '{"id":8176349,"type":"track","name":"Start of Madness","active":true,"mixName":"Original Mix","title":"Start of Madness (Original Mix)","slug":"start-of-madness-original-mix","releaseDate":"2016-08-01","publishDate":"2016-08-01","sampleUrl":"http:\/\/geo-samples.beatport.com\/lofi\/8176349.LOFI.mp3","isPreviewAvailable":true,"rtmpStreamUrl":"null","exclusive":false,"preview":{"mp3":{"http":"http:\/\/geo-samples.beatport.com\/lofi\/8176349.LOFI.mp3","rtmp":"null","offset":{"start":175152,"end":295152}},"mp4":{"http":"http:\/\/geo-samples.beatport.com\/lofi\/8176349.LOFI.mp4","rtmp":"null","offset":{"start":175152,"end":295152}}},"price":{"code":"eur","symbol":"\u20ac","value":130,"display":"\u20ac1.30"},"purchasable":true,"length":"7:17","lengthMs":437880,"bpm":125,"key":{"standard":{"letter":"A","sharp":true,"flat":false,"chord":"minor"},"shortName":"A&#9839;min"},"saleType":"purchase","artists":[{"id":1660,"name":"Hertz","slug":"hertz","type":"artist"},{"id":123787,"name":"Enrico Sangiuliano","slug":"enrico-sangiuliano","type":"artist"}],"genres":[{"id":6,"name":"Techno","slug":"techno","type":"genre"}],"release":{"id":1813471,"name":"A-Sides Volume 5","type":"release","slug":"a-sides-volume-5"},"label":{"id":2027,"name":"Drumcode","type":"label","slug":"drumcode","status":true},"images":{"waveform":{"id":14098610,"width":1500,"height":250,"url":"http:\/\/geo-media.beatport.com\/image\/14098610.png","secureUrl":"https:\/\/media.beatport.com\/image\/14098610.png"}},"dynamicImages":{"main":{"id":14097854,"url":"\/\/geo-media.beatport.com\/image_size{hq}\/{w}x{h}\/14097854.jpg"},"waveform":{"id":14098610,"url":"\/\/geo-media.beatport.com\/image_size{hq}\/{w}x{h}\/14098610.png"}}}';
        onSuccess(JSON.parse(data));
    }

    _getSearchURL(artist, title) {
        //todo: implement
        return "";
    }

}