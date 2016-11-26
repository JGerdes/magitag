window.addEventListener('load', function () {
    console.log('started app');

    let dragDropHandler = new DragDropHandler(document.querySelector('.droparea'));
    dragDropHandler.onDrop = function (items) {
        let files = FileSystem.getFilesFromFilelist(items);
        console.log(files);
    }
});
