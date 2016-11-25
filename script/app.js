window.addEventListener('load', function () {
    console.log('started app');

    let dragDropHandler = new DragDropHandler(document.querySelector('.droparea'));
    dragDropHandler.onFileDrop = function (file) {
        console.log(file);
    }
});
