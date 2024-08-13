const { ipcRenderer } = require("electron");


function createVideo() {
    let mp3path = document.getElementById("mp3file").files[0].path;
    let imagepath = document.getElementById("imagefile").files[0].path;
    let visualizer = document.getElementById('visualizer');
    if (visualizer.value == 'vectorscope') {
        ffmpeg.renderWithVectorscope(mp3path, imagepath);
    }
    else {
        let fixedImageWidth = getImageWidth(document.getElementById("imagefile"));
        ffmpeg.renderWithWaveforms(mp3path, imagepath, fixedImageWidth);
    }
}