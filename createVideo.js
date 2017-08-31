
function printPath() {
    var mp3path = document.getElementById("mp3file").files[0].path;
    var imagepath = document.getElementById("imagefile").files[0].path;
    document.write("mp3:" + mp3path + "<br> image:" + imagepath);
}

function createVideo() {
    var ffmpeg = require('fluent-ffmpeg');

    var mp3path = document.getElementById("mp3file").files[0].path;
    var imagepath = document.getElementById("imagefile").files[0].path;
    // call ffmpeg here?
    /*var ffmpegCommand = ffmpeg(mp3path).input(imagepath).output('output.mp4').on('end', function() {
            console.log('Finished processing');
        })
        .run();;
    */
    ffmpeg().input(mp3path).input(imagepath)
        .videoCodec('libx264')
        .size('1920x1080')
        .audioCodec('libmp3lame')
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
            console.log('Output finished!');
        })
        .save('./output.avi');
}

function getFfmpeg() {
    var ffbinaries = require ('ffbinaries');
    var platform = ffbinaries.detectPlatform();
    ffbinaries.downloadFiles(['ffmpeg', 'ffprobe'], {platform: platform}, function() {
        console.log('Downloaded ffmpeg and ffprobe for platform');
    });
    process.env.FFMPEG_PATH = '.\\ffmpeg.exe';
    process.env.FFPROBE_PATH = '.\\ffprobe.exe';
}
