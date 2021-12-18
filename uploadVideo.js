const { shell } = require('electron');
const google = require('googleapis');
const Lien = require('lien');
const util = require('util');
const fs = require("fs");

let OAuth2 = google.auth.OAuth2;
const scopes = ['https://www.googleapis.com/auth/youtube.upload'];
let output = document.getElementById('output');
let file = fs.readFileSync("credentials.json");
const CREDENTIALS = JSON.parse(file);
let oauth2Client = new OAuth2(
    CREDENTIALS.web.client_id,
    CREDENTIALS.web.client_secret,
    CREDENTIALS.web.redirect_uris[0]
);
let url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

let server = new Lien({
    host: "localhost",
    port: 5000
});


function youtubeAuth() {
    const { shell } = require('electron');
    shell.openExternal('https://google.com');
    server.addPage("/oauth2callback", lien => {
        output.innerHTML += "Trying to get the token using the following code: " + lien.query.code + '\n';
        output.scrollTop = output.scrollHeight - output.clientHeight;
        oauth2Client.getToken(lien.query.code, (err, tokens) => {
            if (err) {
                lien.lien(err, 400);
                output.innerHMTL += err + '\n';
                output.scrollTop = output.scrollHeight - output.clientHeight;
                return console.log(err);
            }
            output.innerHTML += "Got the tokens\n";
            output.scrollTop = output.scrollHeight - output.clientHeight;
            oauth2Client.setCredentials(tokens);
            lien.end("Authentication successful. Please return to the app");
        });
    });
}

function uploadVideo() {
    let youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    });

    let req = youtube.videos.insert({
        part: 'id,snippet,status',
        notifySubscribers: true,
        resource: {
            snippet: {
                title: document.getElementById('vidtitle').value,
                description: "Some of the best video game music around. I don\'t own any of this stuff, but I wanted to share, display, and reference these works of art in my gallery.\nEverything encoded and uploaded with https://github.com/ofsaleem/youtube-mp3-uploader-gui",
                tags: ['music', 'vgmusic', "video game", "video games", 'games', 'gaming', 'consoles', 'pc', 'tracks', '8bit'],
                categoryId: '20' // Gaming
            },
            status: {
                privacyStatus: 'private'
            }
        },
        media: {
            body: fs.createReadStream('output.mp4')
        }
    }, function (err, data) {
        if (err) {
            output.innerHTML += 'Error: ' + err + '\n';
            output.scrollTop = output.scrollHeight - output.clientHeight;
            console.error('Error: ' + err);
        }
        if (data) {
            output.innerHTML += '\n' + util.inspect(data, false, null) + '\n';
            output.scrollTop = output.scrollHeight - output.clientHeight;
        }
        //process.exit();
    });

    let fileSize = fs.statSync('output.mp4').size;

    let id = setInterval(function () {
        let uploadedBytes = req.req.connection._bytesDispatched;
        let uploadedMBytes = uploadedBytes / 1000000;
        let progress = uploadedBytes > fileSize
            ? 100 : (uploadedBytes / fileSize) * 100;
        let text = output.innerHTML;
        output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
        output.innerHTML += '\n' + uploadedMBytes.toFixed(2) + 'MBs uploaded. ' +
            progress.toFixed(2) + '% completed.';
        if (progress === 100) {
            output.InnerHTML += '\nDone uploading, waiting for response...\n';
            clearInterval(id);
        }
        output.scrollTop = output.scrollHeight - output.clientHeight;
    }, 250);
}
