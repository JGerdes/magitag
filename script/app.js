window.addEventListener('load', function () {
    let fileSystem = new FileSystem();
    fileSystem.init();
    let beatportSource = new BeatportSource();
    let fileNameCreator = new FileNameCreator();
    let tagger = new Tagger(fileSystem, window.jsmediatags, beatportSource, fileNameCreator);
    let dragDropHandler = new DragDropHandler(document.querySelector('.droparea'));

    dragDropHandler.onDrop = function (items) {
        for (let i = 0; i < items.length; i++) {
            tagger.process(items[i]);
        }

    }
});
