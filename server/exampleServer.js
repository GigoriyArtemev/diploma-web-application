const express = require('express');
const app = express();
const { dirname } = require('path');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);
const upload = multer({ dest: 'public/videos' });
app.use(express.urlencoded({ extended: false }));
const webSocketServer = new WebSocket.Server({ server });
var clients = {};

webSocketServer.on('connection', (ws) => {
    var id = Math.random();
    clients[id] = ws;
    console.log('новое соединение ' + id);
    ws.on('message', function (message) {
        // console.log("получено сообщение " + message);
        if (String(message).substring(0, 3) === 'new') {
            let sql =
                'INSERT INTO videoBase(ClientID, VideoAddress) VALUES(?, ?)';
            setQueryParams(id, String(message).substring(3));
            queryInsert(sql);
        }
        if (String(message).substring(0, 5) === 'pause') {
            let Mass = [];
            queryParams = String(message).substring(5);

            sql = 'SELECT `ClientID` FROM `videoBase` WHERE VideoAddress = ?';
            connect.query(sql, queryParams, function (err, results) {
                Mass = Object.values(results);
                Mass = Mass.map((a) => a.ClientID);
                for (i = 0; i < Mass.length; ++i) {
                    var temp = Mass[i];
                    temp = Number(temp);
                    //console.log(typeof temp);
                    clients[temp].send('pause!');
                }
            });
        }
        if (String(message).substring(0, 4) === 'play') {
            let Mass = [];
            queryParams = String(message).substring(4);

            sql = 'SELECT `ClientID` FROM `videoBase` WHERE VideoAddress = ?';
            connect.query(sql, queryParams, function (err, results) {
                Mass = Object.values(results);
                Mass = Mass.map((a) => a.ClientID);
                for (i = 0; i < Mass.length; ++i) {
                    var temp = Mass[i];
                    temp = Number(temp);
                    clients[temp].send('play!');
                }
            });
        }
        if (String(message).substring(0, 4) === 'time') {
            let sendMessage = String(message).split(',');
            console.log(sendMessage);
            let Mass = [];
            queryParams = String(sendMessage[2]);

            sql = 'SELECT `ClientID` FROM `videoBase` WHERE VideoAddress = ?';
            connect.query(sql, queryParams, function (err, results) {
                Mass = Object.values(results);
                Mass = Mass.map((a) => a.ClientID);
                for (i = 0; i < Mass.length; ++i) {
                    var temp = Mass[i];
                    temp = Number(temp);
                    if (clients[temp] != ws) {
                        clients[temp].send('time!' + sendMessage[1]);
                    }
                }
            });
        }

        //
    });
    ws.on('close', function () {
        console.log('соединение закрыто ' + id);
        delete clients[id];
        sql = 'DELETE FROM `videoBase` WHERE ClientID = ?';
        queryParams = id;
        connect.query(sql, queryParams, function (err, results) {
            if (err) console.log(err);
            else {
                console.log('Соединение удалёно из таблицы');
                //console.log(results);
            }
            //connect.end();
        });
    });
    ws.on('error', (e) => ws.send(e));

    ws.send('Hi there, I am a WebSocket server');
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get(`/video/:filename`, (req, res) => {
    console.log('вызвался');
    reSrcHTML(req.params.filename + '.mp4');
    res.sendFile(`${__dirname}/public/video.html`);
});

app.post('/upload', upload.single('video'), function (req, res, next) {
    // const form = formidable({ multiples: true });

    let filedata = req.file;
    console.log(filedata);
    if (!filedata) res.send('Ошибка при загрузке файла');
    else {
        fs.rename(
            `public/videos/${filedata.filename}`,
            `public/videos/${filedata.filename}` + '.mp4',
            (err) => {
                if (err) throw err; // не удалось переименовать файл
            }
        );

        res.send(filedata.filename);
    }
});
function reSrcHTML(nameOfVideo) {
    var data = fs.readFileSync('public/video.html', 'utf-8');

    var newValue = data.replace(
        /videosrc(.+)/gim,
        `videosrc" src="/videos/${nameOfVideo}"`
    );

    fs.writeFileSync('public/video.html', newValue, 'utf-8');

    console.log('readFileSync complete');
}

server.listen(8999, () => {
    console.log('Slushaem port 8999!');
});

let queryParams;
function setQueryParams(clientId, videoAddress) {
    queryParams = [clientId, videoAddress];
}

const mysql = require('mysql');

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node_inform',
    password: '',
});
connect.connect((err) => {
    if (err) {
        console.log(err);
        return err;
    } else {
        console.log('connet to database was corrected');
    }
});
function queryInsert(sql) {
    connect.query(sql, queryParams, function (err, results) {
        if (err) console.log(err);
        else {
            console.log('Данные записаны в таблицу');
            console.log(results);
        }
        //connect.end();
    });
    // querySelect();
}

function querySelect(videoAddress) {
    queryParams = videoAddress;
    let Mass = [];
    sql = 'SELECT `ClientID` FROM `videoBase` WHERE VideoAddress = ?';
    connect.query(sql, queryParams, function (err, results) {
        Mass = Object.values(results);
        Mass = Mass.map((a) => a.ClientID);
    });

    return Mass;
}
// //connect.end();
