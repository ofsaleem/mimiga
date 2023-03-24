const { contextBridge, ipcRenderer } = require('electron')

const downloadFFBinaries = () => {
  return ipcRenderer.invoke('get-ffbinaries').then(result => {
    return result;
  }).catch(() => {
    console.error("Error determining platform");
  });
}

const renderWithVectorscope = (mp3path, imagepath) => {
  return ipcRenderer.invoke('ffmpeg-vectorscope', mp3path, imagepath).catch(() => {
    console.error("Error rendering output video file");
  });
}

const renderWithWaveforms = (mp3path, imagepath, fixedImageWidth) => {
  return ipcRenderer.invoke('ffmpeg-waveforms', mp3path, imagepath, fixedImageWidth).catch(() => {
    console.error("Error rendering output video file");
  });
}

contextBridge.exposeInMainWorld(
  'ffbinaries', 
  {
    downloadFFBinaries: () => downloadFFBinaries()
  });
contextBridge.exposeInMainWorld(
  'ffmpeg',
  {
    renderWithVectorscope: (mp3path, imagepath) => renderWithVectorscope(mp3path, imagepath),
    renderWithWaveforms: (mp3path, imagepath, fixedImageWidth) => renderWithWaveforms(mp3path, imagepath, fixedImageWidth)
  }
);

contextBridge.exposeInMainWorld(
  "api", {
      send: (channel, data) => {
          // whitelist channels
          let validChannels = ["ffbinaries", "ffmpeg"];
          if (validChannels.includes(channel)) {
              ipcRenderer.send(channel, data);
          }
      },
      receive: (channel, func) => {
          let validChannels = ["fromMain"];
          if (validChannels.includes(channel)) {
              // Deliberately strip event as it includes `sender` 
              ipcRenderer.on(channel, (event, ...args) => func(...args));
          }
      }
  }
);


ipcRenderer.on('ffmpeg-encoding-start', (event, commandLine) => {
  let output = document.getElementById('output');
  output.innerHTML += 'Spawned Ffmpeg with command: ' + commandLine + '\n' +
  'Beginning encoding\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-progress', (event, progress) => {
  let text = output.innerHTML;
  output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
  output.innerHTML += '\nProcessing: ' + progress.percent + '% done';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-error', (event, err) => {
  output.innerHTML += '\nAn error occurred: ' + err.message + '\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-end', () => {
  output.innerHTML += '\nOutput finished!\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});
