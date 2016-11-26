class FileSystem {

    static getFilesFromFilelist(fileList) {
        let allFiles = [];
        for (let i = 0; i < fileList.length; i++) {
            let item = fileList[i].webkitGetAsEntry();
            allFiles.push(item)
        }
        return allFiles;
    }

}