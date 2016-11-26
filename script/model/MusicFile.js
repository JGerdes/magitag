class MusicFile {

    constructor(file, fileEntry) {
        this._file = file;
        this._fileEntry = fileEntry;
    }

    get file() {
        return this._fileEntry;
    }

    get fileEntry() {
        return this._fileEntry;
    }
}