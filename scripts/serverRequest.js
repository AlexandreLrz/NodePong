var fs = require('fs');

var imgsExtensions = ['png', 'jpg', 'jpeg'];

function send404Error(res) {
    res.write('URL invalide');
    res.end();
}

function sendImage(req, res, extension) {
    var content_type = 'image/' + extension;
    var img = fs.readFileSync('./pages' + req.url);
    res.writeHead(200, {'Content-Type': content_type});
    res.end(img, 'binary');
}

function sendPage(req, res, extension) {
    var content_type;
    fs.readFile('./pages' + req.url, 'utf-8', function(error, content) {
        if(extension == 'js') {
            content_type = 'text/javascript';
        }
        else if(extension == 'html') {
            content_type = 'text/html';
        }
        else if(extension == 'css') {
            content_type = 'text/css';
        }
        if(content != undefined) {
            res.writeHead(200, {"Content-Type": content_type});
            res.write(content);
            res.end();
        }
    });
}

function onServerRequest(req, res) {
    if(fs.existsSync('./pages' + req.url)) {
        var array_ext = req.url.split('.');
        var extension = array_ext[array_ext.length-1];
        if(imgsExtensions.includes(extension)) {
            sendImage(req, res, extension);
        } else {
            sendPage(req, res, extension);
        }
    } else {
        send404Error(res);
    }
}

module.exports = {
    onServerRequest: onServerRequest
}