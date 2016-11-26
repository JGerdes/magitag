class DragDropHandler {

    constructor(dropElement) {
        let self = this;
        this._dropListener = null;

        dropElement.addEventListener('drop', function (event) {
            console.log(event);
            event.stopPropagation();
            event.preventDefault();
            dropElement.classList.remove('dragging');

            let musicFiles = [];
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                let fileEntry = event.dataTransfer.items[i].webkitGetAsEntry();
                let file = event.dataTransfer.files[i];
                musicFiles.push(new MusicFile(fileEntry, file));
            }
            if (self._dropListener != null) {
                self._dropListener(musicFiles);
            }
        });

        dropElement.addEventListener('dragenter', function (event) {
            dropElement.classList.add('dragging');
        });
        dropElement.addEventListener('dragleave', function (event) {
            dropElement.classList.remove('dragging');
        });

        dropElement.addEventListener('dragover', function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });
    }

    set onDrop(listener) {
        this._dropListener = listener;
    }
}