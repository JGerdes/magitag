class FileSystem {

    init() {
        let self = this;
        chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function (entry) {
            chrome.fileSystem.getWritableEntry(entry, function (entry) {
                self.writableFolder = entry;
            });
        });
    }

    saveArrayBufferToFile(filename, arrayBuffer) {
        let blob = new Blob([arrayBuffer]);
        this.saveBlobToFile(filename, blob);
    }

    saveBlobToFile(filename, blob) {
        this.writableFolder.getFile(filename, {create: true}, function (entry) {
            entry.createWriter(function (writer) {
                writer.write(blob);
            });
        });
    }
}