window.addEventListener('load', function () {
    //todo: refacor all this
    console.log('started app');

    let fileSystem = new FileSystem();
    fileSystem.init();
    let beatportSource = new BeatportSource();

    let tagger = new Tagger(fileSystem, window.jsmediatags, beatportSource);
    let dragDropHandler = new DragDropHandler(document.querySelector('.droparea'));

    dragDropHandler.onDrop = function (items) {
        items.forEach(function (item) {
            tagger.process(item.file);
        });
    }
});
