class Tag {
    constructor() {
        this.title = null;
        this.mixName = null;
        this.artists = [];
        this.mixArtist = null;
        this.releaseName = null;
        this.trackNumber = null;
        this.totalTracks = null;
        this.year = null;
        this.label = null;
        this.catalogNumber = null;
        this.bpm = null;
        this.key = null;
        this.genres = [];
        this.cover = null;

        this.beatportId = null;
        this.beatportReleaseId = null;
    }


    applyToTagWriter(writer) {
        this._writeIfNotNull(writer, 'TIT2', this.title);
        this._writeCustomIfNotNull(writer, 'MIXNAME', this.mixName);
        this._writeArray(writer, 'TPE1', this.artists);
        this._writeIfNotNull(writer, 'TPE3', this.mixArtist);
        this._writeIfNotNull(writer, 'TALB', this.releaseName);
        this._writeConcatedArray(writer, 'TRCK', [
            this.trackNumber,
            this.totalTracks
        ], '/');
        this._writeIfNotNull(writer, 'TYER', this.year);
        this._writeIfNotNull(writer, 'TPUB', this.label);
        this._writeCustomIfNotNull(writer, 'CATALOGNUMBER', this.catalogNumber);
        this._writeIfNotNull(writer, 'TBPM', this.bpm);
        this._writeIfNotNull(writer, 'TKEY', this.key);
        this._writeArray(writer, 'TCON', this.genres);

        this._writeIfNotNull(writer, 'APIC', this.cover);

        this._writeCustomIfNotNull(writer, 'BEATPORT_TRACK_ID', this.beatportId);
        this._writeCustomIfNotNull(writer, 'BEATPORT_RELEASE_ID', this.beatportReleaseId);
    }

    _writeIfNotNull(writer, frame, value) {
        if (value !== null) {
            writer.setFrame(frame, value);
        }
    }

    _writeCustomIfNotNull(writer, description, value) {
        if (value !== null) {
            writer.setFrame('TXXX', {
                description: description,
                value: value
            });
        }
    }

    _writeArray(writer, frame, valueArray) {
        valueArray.forEach(function (value) {
            value = [value];
            writer.setFrame(frame, value);
        });
    }

    _writeConcatedArray(writer, frame, valueArray, separator) {
        let concated = '';
        valueArray.forEach(function (value) {
            if (value === null) {
                return;
            }
            if (concated.length > 0) {
                concated += separator;
            }
            concated += value;
        });

        writer.setFrame(frame, concated);

    }
}