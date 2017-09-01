function createVideo() {
    var ffmpeg = require('fluent-ffmpeg');
    var mp3path = document.getElementById("mp3file").files[0].path;
    var imagepath = document.getElementById("imagefile").files[0].path;
    ffmpeg().input(mp3path).input(imagepath)
        .inputOptions(['-loop 1'])
        .complexFilter([
            {
                /*filter: 'showwaves',
                options: {
                    s: '1920x1080',
                    mode: 'line',
                    rate: '24',
                    scale: 'cbrt',
                    colors: 'cyan|gray'
                },*/
                filter: 'avectorscope',
                options: {
                    s: '1920x1080',
                    rate: '24',
                    zoom: '6',
                    draw: 'line'
                },
                inputs: '0:a',
                outputs: 'outa'
            },
            {
                filter: 'scale',
                options: {
                    w: '1920',
                    h: '1080',
                    force_original_aspect_ratio: 'decrease'
                },
                inputs: '1:v',
                outputs: 'outv'
            },
            {
                filter: 'overlay',
                options: {
                    x: '(W-w)/2',
                    y: '(H-h)/2'
                },
                inputs: ['outa', 'outv'],
                outputs: 'out'
            },
            {
                filter: 'scale',
                options: {
                    w: '1920',
                    h: '1080'
                },
                inputs: 'out',
                outputs: 'out'
            }

        ], 'out')
        //.outputOption(['-filter_complex "[0:a]showwaves=s=1920x1080:mode=line:rate=24:scale=sqrt:colors=cyan|gray[outa]; [1:v]scale=w=1920:h=1080:force_original_aspect_ratio=decrease[outv]; [outa][outv]overlay=(W-w)/2:(H-h)/2,scale=w=1920:h=1080[out]" -map "[out]" -map 0:a'])
        .outputOption(['-map 0:a'])
        .videoCodec('libx264')
        //.size('1920x1080')
        //.outputOption(['-filter_complex "[0:a]avectorscope=s=640x518[left]; [0:a]showspectrum=mode=separate:color=intensity:scale=cbrt:s=640x518[right];"'])
        .outputOption(['-tune stillimage'])
        .outputOption(['-crf 18'])
        .audioCodec('aac')
        .audioBitrate(320)
        .outputOption(['-pix_fmt yuv420p'])
        .fpsOutput(24)
        .outputOption(['-preset veryfast'])
        .outputOption(['-movflags +faststart'])
        .outputOption(['-profile:v high'])
        .outputOption(['-level 4.0'])
        .outputOption(['-bf 2'])
        .outputOption(['-g 12'])
        .outputOption(['-coder 1'])
        .audioChannels(2)
        .audioFrequency(48000)
        .outputOption(['-shortest'])
        .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
            console.log('Output finished!');
        })
        //TODO: add cool spectrograph effects?
        //.outputOptions(['-c:v libx264', '-tune stillimage', '-crf 18', '-c:a aac', '-b:a 320k', '-pix_fmt yuv420p', '-r 24', '-preset veryslow', '-movflags +faststart', '-profile:v high', '-level 4.0', '-bf 2', '-g 12', '-coder 1', '-ac 2', '-ar 48000', '-shortest'])
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
