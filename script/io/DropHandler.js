class DragDropHandler {

    constructor(dropElement) {
        let self = this;
        this._dropListener = null;

        dropElement.addEventListener('drop', function (event) {
            console.log(event);
            event.stopPropagation();
            event.preventDefault();
            dropElement.classList.remove('dragging');

            if(self._dropListener != null) {
                self._dropListener(event.dataTransfer.items);
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