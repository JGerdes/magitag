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
                        downloadInBufferArray(coverUrl, function (cover) {
                            writer.setFrame('APIC', cover);
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


function downloadInBufferArray(url, callback) {
    var d = new XMLHttpRequest();
    d.responseType = "arraybuffer";
    d.addEventListener("load", function (a) {
        if (d.status === 200) {
            callback(d.response);
        } else {
            callback(null);
        }
    });
    d.open("GET", url, true);
    d.send();
}
