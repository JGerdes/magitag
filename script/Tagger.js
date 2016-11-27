class Tagger {

    constructor(filesystem, jsmediatags, source, fileNameCreator) {
        this._filesystem = filesystem;
        this._jsmediatags = jsmediatags;
        this._source = source;
        this._fileNameCreator = fileNameCreator;
    }


    process(file) {
        let self = this;
        this._jsmediatags.read(file, {
            onSuccess: function (tag) {
                self._source.requestTags(tag.tags.artist, tag.tags.title, function (tag) {
                    console.log(tag);
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        let buffer = event.target.result;
                        let writer = new ID3Writer(buffer);

                        tag.applyToTagWriter(writer);
                        writer.addTag();

                        let fileName = self._fileNameCreator.createFileName(tag);
                        self._filesystem.saveArrayBufferToFile(fileName, writer.arrayBuffer);
                    };
                    reader.readAsArrayBuffer(file);
                });
            },

            onError: function (error) {
                console.log(':(', error.type, error.info);
            }
        });
    }
}