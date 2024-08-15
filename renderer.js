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

const createBtn = document.getElementById('create-video');
createBtn.addEventListener('click', () => {
    const mp3path = document.getElementById("mp3file").files[0].path;
    const imagepath = document.getElementById("imagefile").files[0].path;
    const visualizer = document.getElementById('visualizer');
    if (visualizer.value == 'vectorscope') {
        window.ffmpeg.renderWithVectorscope(mp3path, imagepath);
    }
    else {
        let fixedImageWidth = getImageWidth(document.getElementById("imagefile"));
        window.ffmpeg.renderWithWaveforms(mp3path, imagepath, fixedImageWidth);
    }
})

const getFfmpegBtn = document.getElementById('get-Ffmpeg');
getFfmpegBtn.addEventListener('click', async () => {
    let platform = await window.ffbinaries.downloadFFBinaries();
    output.innerHTML += '\nDownloaded ffmpeg and ffprobe for platform ' + platform;
    output.scrollTop = output.scrollHeight - output.clientHeight;
})

const authBtn = document.getElementById('youtube-auth');
authBtn.addEventListener('click', async () => {
    
})

const uploadBtn = document.getElementById('upload-video');