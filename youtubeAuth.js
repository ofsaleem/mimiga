function youtubeAuth() {
    var fs = require("fs");
    var file = fs.readFileSync("credentials.json");
    const CREDENTIALS = JSON.parse(file);

    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    var params = {
        'client_id': CREDENTIALS.web.client_id,
        'response_type': 'token',
        //'redirect_uri': CREDENTIALS.web.redirect_uris[0],
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
}
