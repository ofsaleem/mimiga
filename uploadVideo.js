var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var Lien = require('lien');
var open = require('open');
var util = require('util');
var fs = require("fs");
var scopes = ['https://www.googleapis.com/auth/youtube.upload'];
var output = document.getElementById('output');
var file = fs.readFileSync("credentials.json");
const CREDENTIALS = JSON.parse(file);
var oauth2Client = new OAuth2(
    CREDENTIALS.web.client_id,
    CREDENTIALS.web.client_secret,
    CREDENTIALS.web.redirect_uris[0]
);
var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

var server = new Lien({
    host: "localhost",
    port: 5000
});


function youtubeAuth() {
    open(url);
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
    var youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    });

    var req = youtube.videos.insert({
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
                privacyStatus: 'public'
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

    var fileSize = fs.statSync('output.mp4').size;

    var id = setInterval(function () {
        var uploadedBytes = req.req.connection._bytesDispatched;
        var uploadedMBytes = uploadedBytes / 1000000;
        var progress = uploadedBytes > fileSize
            ? 100 : (uploadedBytes / fileSize) * 100;
        var text = output.innerHTML;
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
