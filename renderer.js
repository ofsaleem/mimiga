const createBtn = document.getElementById('create-video');
createBtn.addEventListener('click', () => {
    const mp3path = document.getElementById("mp3file").files[0].path;
    const imagepath = document.getElementById("imagefile").files[0].path;
    const visualizer = document.getElementById('visualizer');
    if (visualizer.value == 'vectorscope') {
        ffmpeg.renderWithVectorscope(mp3path, imagepath);
    }
    else {
        let fixedImageWidth = getImageWidth(document.getElementById("imagefile"));
        ffmpeg.renderWithWaveforms(mp3path, imagepath, fixedImageWidth);
    }
})

const getFfmpegBtn = document.getElementById('get-Ffmpeg');
getFfmpegBtn.addEventListener('click', async () => {
    let platform = await window.ffbinaries.downloadFFBinaries();
    output.innerHTML += '\nDownloaded ffmpeg and ffprobe for platform ' + platform;
    output.scrollTop = output.scrollHeight - output.clientHeight;
})

const authBtn = document.getElementById('youtube-auth');
const uploadBtn = document.getElementById('upload-video');