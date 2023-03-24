async function getFfmpeg() {
    let platform = await ffbinaries.downloadFFBinaries();
    output.innerHTML += '\nDownloaded ffmpeg and ffprobe for platform ' + platform;
    output.scrollTop = output.scrollHeight - output.clientHeight;
}

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

function getImageWidth(input) {
    let fixedImageWidth = 600;
    let fr = new FileReader;
    fr.onload = () => {
        let img = new Image;
        img.onload = () => {
            let imagewidth = +img.width;
            let imageheight = +img.height;
            let ar = imagewidth * 1.0 / imageheight;
            ar = +(parseFloat(ar.toFixed(2)));
            fixedImageWidth = 600 * ar;
            fixedImageWidth = +fixedImageWidth.toFixed(0);
        };
        img.src = fr.result;
    };
    fr.readAsDataURL(input.files[0]);
    return fixedImageWidth;
}
