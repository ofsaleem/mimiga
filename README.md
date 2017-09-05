youtube mp3 uploader gui in node + electron

takes audio file and image file and creates a video, then uploads it to youtube. also adds one of two visualizers, a blurred vectorscope behind the album art or a blurred pair of waveforms above and below the album art

1. select audio file
2. select image file
3. hit download ffmpeg (only need to do this once per install, or when you want to update ffmpeg)
4. optionally choose visualizer. defaults to vectorscope.
5. hit create video
6. when thats complete, hit authenticate
7. after authentication is complete, hit upload video

allows you to set the title but nothing else

since its using ffmpeg, the app should support any audio and image file types that ffmpeg works with.

currently there's no robustness at all with this, so if you do anything not in the intended order, or input the files in the wrong places or something, the app will break.

if you want, you can also use it to upload any video you want. just put the video in the root of the app directory and name it output.mp4 (not sure if it needs to be an actual mp4 or if youtube is smart enough to handle that), then just use the authenticate + upload buttons. if you hit create video at any point, it will override output.mp4.

the app uses oauth2 to auth your youtube account so there's no user/pass system involved.
