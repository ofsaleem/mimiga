function createVideo() {
    var ffmpeg = require('fluent-ffmpeg');
    var mp3path = document.getElementById("mp3file").files[0].path;
    var imagepath = document.getElementById("imagefile").files[0].path;
    ffmpeg().input(mp3path).input(imagepath).inputOptions(['-loop 1'])
    /*
        .videoCodec('libx264')
        .audioCodec('libmp3lame')
        .audioQuality(0)
        */
        .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
            console.log('Output finished!');
        })
        //TODO: add progress bar
        /*
        .format('avi')
        .outputOption('-pix_fmt yuv420p')
        .outputOption('-crf 18')
    */
        .outputOptions(['-c:v libx264', '-tune stillimage', '-crf 18', '-c:a aac', '-b:a 320k', '-pix_fmt yuv420p', '-r 24', '-preset veryslow', '-movflags +faststart', '-profile:v high', '-level 4.0', '-bf 2', '-g 12', '-coder 1', '-ac 2', '-ar 48000', '-shortest'])
        .save('output.mp4');
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
