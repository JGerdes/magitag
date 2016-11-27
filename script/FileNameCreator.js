class FileNameCreator {

    createFileName(tag) {
        let fileName = '';
        tag.artists.forEach(function (artist) {
            if (fileName.length > 0) {
                fileName += ", ";
            }
            fileName += artist;
        });
        fileName += " - " + tag.title;

        if (tag.mixName !== null) {
            fileName += " (" + tag.mixName + ")";
        }

        fileName += ".mp3";

        return fileName;
    }
}