var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var Lien = require('lien');
var opn = require('opn');
var util = require('util');
var readline = require('readline');
var fs = require("fs");
var scopes = ['https://www.googleapis.com/auth/youtube.upload'];
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
    opn(url);
    server.addPage("/oauth2callback", lien => {
        console.log("Trying to get the token using the following code: " + lien.query.code);
        oauth2Client.getToken(lien.query.code, (err, tokens) => {
            if (err) {
                lien.lien(err, 400);
                return console.log(err);
            }
            console.log("Got the tokens");
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
        notifySubscribers: false,
        resource: {
            snippet: {
                title: 'Dragon Age Inquisition Title Theme',
                description: 'Test upload tbh'
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
            console.error('Error: ' + err);
        }
        if (data) {
            console.log(util.inspect(data, false, null));
        }
        //process.exit();
    });

    var fileSize = fs.statSync('output.mp4').size;

    var id = setInterval(function () {
        var uploadedBytes = req.req.connection._bytesDispatched;
        var uploadedMBytes = uploadedBytes / 1000000;
        var progress = uploadedBytes > fileSize
            ? 100 : (uploadedBytes / fileSize) * 100;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(uploadedMBytes.toFixed(2) + 'MBs uploaded. ' +
            progress.toFixed(2) + '% completed.');
            if (progress === 100) {
                process.stdout.write('\nDone uploading, waiting for response...\n');
                clearInterval(id);
            }
    }, 250);
}
