class DragDropHandler {

    constructor(dropElement) {
        let self = this;
        this._fileListener = null;

        dropElement.addEventListener('drop', function (event) {
            event.stopPropagation();
            event.preventDefault();
            let files = event.dataTransfer.files;
            let i = 0, file;
            for (; file = files[i]; i++) {
                if (self._fileListener != null) {
                    self._fileListener(file);
                }
            }
            dropElement.classList.remove('dragging');
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

    set onFileDrop(listener) {
        this._fileListener = listener;
    }
}