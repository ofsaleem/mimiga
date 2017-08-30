function printPath() {
    var mp3path = document.getElementById("mp3file").files[0].path;
    var imagepath = document.getElementById("imagefile").files[0].path;
    document.write("mp3:" + mp3path + "<br> image:" + imagepath);
}
