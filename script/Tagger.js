class Tagger {

    constructor(filesystem, jsmediatags, source) {
        this._filesystem = filesystem;
        this._jsmediatags = jsmediatags;
        this._source = source;
    }


    process(file) {
        let self = this;
        this._jsmediatags.read(file, {
            onSuccess: function (tag) {
                self._source.requestTags(tag.tags.artist, tag.tags.title, function (data) {
                    console.log(data);
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        let buffer = event.target.result;
                        let writer = new ID3Writer(buffer);

                        let key = data.key.standard.letter;
                        if (data.key.standard.flat) {
                            key += 'b';
                        }
                        if (data.key.standard.sharp) {
                            key += '#';
                        }
                        if (data.key.standard.chord === 'minor') {
                            key += 'm';
                        }
                        console.log('key')
                        writer.setFrame('TIT2', data.name)
                            .setFrame('TPUB', data.label.name)
                            .setFrame('TALB', data.release.name)
                            .setFrame('TYER', new Date(data.releaseDate).getYear() + 1900)
                            .setFrame('TRCK', data.trackId + '/' + data.totalTracks)
                            .setFrame('TBPM', data.bpm)
                            .setFrame('TKEY', key)
                            .setFrame('TXXX', {
                                description: 'MIXNAME',
                                value: data.mixName
                            })
                            .setFrame('TXXX', {
                                description: 'CATALOGNUMBER',
                                value: data.catalogNumber
                            })
                            .setFrame('TXXX', {
                                description: 'BEATPORT_TRACK_ID',
                                value: data.id
                            })
                            .setFrame('TXXX', {
                                description: 'BEATPORT_RELEASE_ID',
                                value: data.release.id
                            });
                        for (let i = 0; i < data.genres.length; i++) {
                            writer.setFrame('TCON', [data.genres[0].name]);
                        }
                        let fileName = "";
                        for (let i = 0; i < data.artists.length; i++) {
                            if (data.artists[i].type === 'artist') {
                                writer.setFrame('TPE1', [data.artists[i].name]);
                                if (fileName.length > 0) {
                                    fileName += ", ";
                                }
                                fileName += data.artists[i].name;
                            }
                            if (data.artists[i].type === 'remixer') {
                                writer.setFrame('TPE4', data.artists[i].name);
                            }
                        }

                        let coverUrl = 'http:' + data.dynamicImages.main.url;
                        coverUrl = coverUrl.replace('{hq}', '_hq')
                            .replace('{w}', '1024')
                            .replace('{h}', '1024');
                        Network.getAsArrayBuffer(coverUrl, function (cover) {
                            if (cover !== null) {
                                writer.setFrame('APIC', cover);
                            }
                            writer.addTag();
                            fileName += " - " + data.title + ".mp3";
                            self._filesystem.saveArrayBufferToFile(fileName, writer.arrayBuffer);
                        });
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