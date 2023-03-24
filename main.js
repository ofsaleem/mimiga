const { app, BrowserWindow, ipcMain } = require('electron');
// include the Node.js 'path' module at the top of your file
const path = require('path');
const ffbinaries = require('ffbinaries-extra');
const ffmpeg = require('fluent-ffmpeg');

function createWindow () {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    win.loadFile('index.html')
    // Open the DevTools.
    win.webContents.openDevTools();
  }

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('get-ffbinaries', async (event, arg) => {
  let platform = ffbinaries.currentPlatform;
  await ffbinaries.downloadBinaries({components: ["ffmpeg", "ffprobe"]});
  //process.env.FFMPEG_PATH = '.\\ffmpeg.exe';
  //process.env.FFPROBE_PATH = '.\\ffprobe.exe';
  return platform;
});

ipcMain.handle('ffmpeg-vectorscope', async (event, mp3path, imagepath) => {
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
  .on('start', (commandLine) => {
    event.sender.send('ffmpeg-encoding-start', commandLine);
  })
  .on('progress', (progress) => {
    event.sender.send('ffmpeg-encoding-progress', progress);
  })
  .on('error', (err) => {
    event.sender.send('ffmpeg-encoding-error', err);
  })
  .on('end', () => {
    event.sender.send('ffmpeg-encoding-end');
  })
  .save('output.mp4');
});

ipcMain.handle('ffmpeg-waveforms', async (event, mp3path, imagepath, fixedImageWidth) => {
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
              s: fixedImageWidth + 'x400',
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
  .on('start', (commandLine) => {
    event.sender.send('ffmpeg-encoding-start', commandLine);
  })
  .on('progress', (progress) => {
    event.sender.send('ffmpeg-encoding-progress', progress);
  })
  .on('error', (err) => {
    event.sender.send('ffmpeg-encoding-error', err);
  })
  .on('end', () => {
    event.sender.send('ffmpeg-encoding-end');
  })
  .save('output.mp4');
});
