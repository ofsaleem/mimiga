var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var Lien = require('lien');
var opn = require('opn');
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

var youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
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
            lien.end("Authentication successful. Please return to the app");
        });
    });

/*
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
            body: fs.createReadStream('output.avi')
        }
    }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            console.log(util.inspect(data, false, null));
        }
        process.exit();
    });

    var fileSize = fs.statSync('output.avi').size;

    var id = setInterval(function () {
        var uploadedBytes = req.req.connection._bytesDispatched;
        var uploadedMBytes = uploadedBytes / 1000;
        var progress = uploadedBytes > fileSize
            ? 100 : (uploadedBytes / fileSize) * 100;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(uploadedMBytes.toFixed(2) + 'MBs uploaded. ' +
            progress.toFixed(2) + '% completed.');
            if (progress === 100) {
                process.stdout.write('\nDone uploading, waiting for response...\n');
                clearInterval(id);
            }
    }, 250);
*/

/*    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    var params = {
        'client_id': CREDENTIALS.web.client_id,
        'response_type': 'token',
        'redirect_uri': CREDENTIALS.web.redirect_uris[0],
        'scope': 'https://www.googleapis.com/auth/youtube.upload',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'};
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
*/
}

function uploadVideo() {
    
}
