class Network {

    static get(url, callback) {
        var d = new XMLHttpRequest;
        d.addEventListener("load", function (a) {
            callback(a.target.responseText)
        });
        d.open("GET", url);
        d.send();
    }

    static getAsArrayBuffer(url, callback) {
        callback(null);
        /*var d = new XMLHttpRequest();
         d.responseType = "arraybuffer";
         d.addEventListener("load", function (a) {
         if (d.status === 200) {
         callback(d.response);
         } else {
         callback(null);
         }
         });
         d.open("GET", url, true);
         d.send();*/
    }
}