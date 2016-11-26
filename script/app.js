var jsmediatags = window.jsmediatags;
window.addEventListener('load', function () {
    //todo: refacor all this
    console.log('started app');

    let beatportSource = new BeatportSource();

    let dragDropHandler = new DragDropHandler(document.querySelector('.droparea'));
    dragDropHandler.onDrop = function (items) {
        console.log(items[0]);
        jsmediatags.read(items[0].file, {
            onSuccess: function (tag) {
                beatportSource.requestTags(tag.tags.artist, tag.tags.title, function (data) {
                    console.log(data);
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        let buffer = event.target.result;
                        let writer = new ID3Writer(buffer);
                        writer.setFrame('TIT2', data.name)
                            .setFrame('TPUB', data.label.name)
                            .setFrame('TALB', data.release.name)
                            .setFrame('TBPM', data.bpm)
                            .setFrame('TKEY', data.key.standard.letter)
                            .setFrame('TXXX', {
                                description: 'MIXNAME',
                                value: data.mixName
                            });
                        let fileName = "";
                        for (let i = 0; i < data.artists.length; i++) {
                            writer.setFrame('TPE1', [data.artists[i].name]);
                            if (i > 0) {
                                fileName += ", ";
                            }
                            fileName += data.artists[i].name;
                        }
                        writer.addTag();

                        fileName += " - " + data.title + ".mp3";
                        let blob = new Blob([writer.arrayBuffer]);
                        chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function (entry) {
                            chrome.fileSystem.getWritableEntry(entry, function (entry) {
                                entry.getFile(fileName, {create: true}, function (entry) {
                                    entry.createWriter(function (writer) {
                                        writer.write(blob);
                                    });
                                });
                            });
                        });
                    };
                    reader.readAsArrayBuffer(items[0].file);
                });
            },
            onError: function (error) {
                console.log(':(', error.type, error.info);
            }
        });

    }
});
