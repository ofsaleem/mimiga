
function printPath() {
    var mp3path = document.getElementById("mp3file").files[0].path;
    var imagepath = document.getElementById("imagefile").files[0].path;
    document.write("mp3:" + mp3path + "<br> image:" + imagepath);
}

function createVideo() {
    var mp3path = document.getElementById("mp3file").files[0].path;
    var imagepath = document.getElementById("imagefile").files[0].path;
    // call ffmpeg here?
}

function getFfmpeg() {
    var ffbinaries = require ('ffbinaries');
    var platform = ffbinaries.detectPlatform();
    ffbinaries.downloadFiles(['ffmpeg'], {platform: platform}, function() {
        console.log('Downloaded ffmpeg for platform');
    });

}
