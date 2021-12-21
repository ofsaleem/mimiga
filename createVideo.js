let fixedimagewidth = 600;
function getImageWidth(input) {
    let fr = new FileReader;
    fr.onload = function() {
        let img = new Image;
        img.onload = function() {
            let imagewidth = +img.width;
            let imageheight = +img.height;
            let ar = imagewidth * 1.0 / imageheight;
            ar = +(parseFloat(ar.toFixed(2)));
            fixedimagewidth = 600 * ar;
            fixedimagewidth = +fixedimagewidth.toFixed(0);
        };
        img.src = fr.result;
    };
    fr.readAsDataURL(input.files[0]);
}

function renderWithWaveforms(mp3path, imagepath, output) {
    ffmpeg().input(mp3path).input(imagepath)
    .inputOptions(['-loop 1'])
    .complexFilter([
        {
            filter: 'color',
            options: {
                s: '1920x1080',
                c: 'black'
            },
            outputs: ['blackbg']
        },
        {
            filter: 'showwaves',
            options: {
                s: fixedimagewidth + 'x400',
                rate: '24',
                colors: 'cyan|gray',
                mode: 'line',
                scale: 'sqrt'
            },
            inputs: ['0:a'],
            outputs: ['wave']
        },
        {
            filter: 'split',
            inputs: ['wave'],
            outputs: ['wave1', 'wave2']
        },
        {
            filter: 'scale',
            options: {
                w: '-1',
                h: '600',
            },
            inputs: ['1:v'],
            outputs: ['pic']
        },
        {
            filter: 'overlay',
            options: {
                x: '(W-w)/2',
                y: '40',
                eval: 'init'
            },
            inputs: ['blackbg', 'wave1'],
            outputs: ['waves']
        },
        {
            filter: 'overlay',
            options: {
                x: '(W-w)/2',
                y: '640',
                eval: 'init'
            },
            inputs: ['waves', 'wave2'],
            outputs: ['bg']
        },
        {
            filter: 'boxblur',
            options: [
                '20',
                '2'
            ],
            inputs: ['bg'],
            outputs: ['bg']
        },
        {
            filter: 'overlay',
            options: {
                x: '(W-w)/2',
                y: '(H-h)/2',
                eval: 'init'
            },
            inputs: ['bg', 'pic'],
            outputs: ['out']
        }
    ], 'out')
    .outputOption(['-map 0:a'])
    .videoCodec('libx264')
    .outputOption(['-crf 20'])
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
        output.innerHTML += 'Spawned Ffmpeg with command: ' + commandLine + '\n' +
        'Beginning encoding\n';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .on('progress', function(progress) {
        let text = output.innerHTML;
        output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
        output.innerHTML += '\nProcessing: ' + progress.percent + '% done';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .on('error', function(err) {
        output.innerHTML += '\nAn error occurred: ' + err.message + '\n';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .on('end', function() {
        output.innerHTML += '\nOutput finished!\n';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .save('output.mp4');
}

function renderWithVectorscope(mp3path, imagepath, output) {
    ffmpeg().input(mp3path).input(imagepath)
    .inputOptions(['-loop 1'])
    .complexFilter([
        {
            filter: 'avectorscope',
            options: {
                s: '1920x1080',
                rate: '24',
                zoom: '6',
                draw: 'line',
            },
            inputs: '0:a',
            outputs: 'outa'
        },
        {
            filter: 'boxblur',
            options: [
                '40',
                '2'
            ],
            inputs: ['outa'],
            outputs: ['outa']
        },
        {
            filter: 'scale',
            options: {
                w: '500',
                h: '-1'
            },
            inputs: '1:v',
            outputs: 'outv'
        },
        {
            filter: 'overlay',
            options: {
                x: '(W-w)/2',
                y: '(H-h)/2',
                eval: 'init'
            },
            inputs: ['outa', 'outv'],
            outputs: 'out'
        }
    ], 'out')
    .outputOption(['-map 0:a'])
    .videoCodec('libx264')
    .outputOption(['-crf 20'])
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
        output.innerHTML += 'Spawned Ffmpeg with command: ' + commandLine + '\n' +
        'Beginning encoding\n';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .on('progress', function(progress) {
        let text = output.innerHTML;
        output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
        output.innerHTML += '\nProcessing: ' + progress.percent + '% done';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .on('error', function(err) {
        output.innerHTML += '\nAn error occurred: ' + err.message + '\n';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .on('end', function() {
        output.innerHTML += '\nOutput finished!\n';
        output.scrollTop = output.scrollHeight - output.clientHeight;
    })
    .save('output.mp4');
}

function createVideo() {
    let mp3path = document.getElementById("mp3file").files[0].path;
    let imagepath = document.getElementById("imagefile").files[0].path;
    let output = document.getElementById('output');
    let visualizer = document.getElementById('visualizer');
    if (visualizer.value == 'vectorscope') {
        renderWithVectorscope(mp3path, imagepath, output);
    }
    else {
        renderWithWaveforms(mp3path, imagepath, output);
    }
}

function getFfmpeg() {
    const ffbinaries = require('ffbinaries-extra');
    let platform = ffbinaries.detectPlatform();
    ffbinaries.downloadFiles(['ffmpeg', 'ffprobe'], {platform: platform}, function() {
        output.innerHTML += '\nDownloaded ffmpeg and ffprobe for platform ' + platform;
        output.scrollTop = output.scrollHeight - output.clientHeight;
    });
    process.env.FFMPEG_PATH = '.\\ffmpeg.exe';
    process.env.FFPROBE_PATH = '.\\ffprobe.exe';
}
