var jsmediatags = window.jsmediatags;
window.addEventListener('load', function () {
    console.log('started app');

    let dragDropHandler = new DragDropHandler(document.querySelector('.droparea'));
    dragDropHandler.onDrop = function (items) {
        console.log(items[0]);
        jsmediatags.read(items[0].file, {
            onSuccess: function (tag) {
                console.log(tag);
            },
            onError: function (error) {
                console.log(':(', error.type, error.info);
            }
        });
    }
});
