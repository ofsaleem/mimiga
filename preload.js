import { contextBridge, ipcRenderer } from 'electron';

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

const getClientByParsing = () => {
  return ipcRenderer.invoke('auth-parse').catch( () => {
    console.error('Error parsing credentials.json');
    output.innerHTML += 'Error parsing credentials.json \n';
  }).then( () => {
    output.innerHTML += 'Project secrets parsed successfully \n';
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
  'youtube',
  {
    auth: () => {
      let client = getClientByParsing();
    },
    upload: () => {}
  }
);

ipcRenderer.on('ffmpeg-encoding-start', (event, commandLine) => {
  output = document.getElementById('output');
  output.innerHTML += 'Spawned Ffmpeg with command: ' + commandLine + '\n' +
  'Beginning encoding\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-progress', (event, progress) => {
  let text = output.innerHTML;
  output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
  let num = new Number(progress.percent)
  output.innerHTML += '\nProcessing: ' + num.toFixed(2) + '% done';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-error', (event, err) => {
  output.innerHTML += '\nAn error occurred: ' + err.message + '\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-end', () => {
  let text = output.innerHTML;
  output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
  output.innerHTML += '\nProcessing: 100% done';
  output.innerHTML += '\nOutput finished!\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('log', (log) => {
  console.log(log)
});
