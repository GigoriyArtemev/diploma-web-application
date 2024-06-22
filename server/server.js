const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const http = require('http');
const multer = require('multer');

const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');

const path = require('path');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });
const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.use('/userUploads', express.static(path.join(__dirname, 'userUploads')));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({ url: `/uploads/${req.file.filename}` });
});

const addNewPage = (url, id) => {
    if (!pageData[url]) {
        pageData[url] = {
            ids: [id],
            logs: [],
            videoLink: '',
        };
    } else {
        pageData[url].ids.push(id);
    }
};

const deleteIdFromPage = (id) => {
    for (const url in pageData) {
        if (pageData.hasOwnProperty(url)) {
            const ids = pageData[url].ids;
            const indexToRemove = ids.indexOf(id);
            if (indexToRemove !== -1) {
                ids.splice(indexToRemove, 1);
                removePageData(url);
                return;
            }
        }
    }

    console.error(`Ошибка: Уникальный ID ${id} не найден.`);
};

const removePageData = (url) => {
    if (pageData[url]) {
        if (pageData[url].ids.length === 0) {
            deleteUploadVideo(pageData[url].videoLink);
            delete pageData[url];
        } else {
            console.error(`Ошибка: Запись для URL ${url} все еще содержит ID.`);
        }
    } else {
        console.error(`Ошибка: Запись для URL ${url} не существует.`);
    }
};

const deleteUploadVideo = (filePath) => {
    const parts = filePath.split('/');
    const firstTwoParts = parts[0] + '/' + parts[1];

    if (firstTwoParts === '/uploads') {
        fs.unlink(path.resolve(__dirname + filePath), (err) => {
            if (err) {
                console.error('Ошибка при удалении файла:', err);
            } else {
                console.log(`Файл ${filePath} удален.`);
            }
        });
    }
};
const addNewMessage = (id, message) => {
    for (const url in pageData) {
        if (pageData.hasOwnProperty(url)) {
            const ids = pageData[url].ids;
            if (ids.includes(id)) {
                pageData[url].logs.push(message);
                return;
            }
        }
    }

    console.error(`Ошибка: Уникальный ID ${id} не найден.`);
};

const getGroupIdsFromPage = (id) => {
    for (const url in pageData) {
        if (pageData.hasOwnProperty(url)) {
            const ids = pageData[url].ids;
            if (ids.includes(id)) {
                return pageData[url].ids;
            }
        }
    }

    console.error(`Ошибка: Уникальный ID ${id} не найден.`);
};

const checkLinkToFile = (id) => {
    for (const url in pageData) {
        if (pageData.hasOwnProperty(url)) {
            const ids = pageData[url].ids;
            if (ids.includes(id)) {
                deleteUploadVideo(pageData[url].videoLink);
                return;
            }
        }
    }

    console.error(`Ошибка: Уникальный ID ${id} не найден.`);
};

const changeVideoLink = (id, link) => {
    for (const url in pageData) {
        if (pageData.hasOwnProperty(url)) {
            const ids = pageData[url].ids;
            if (ids.includes(id)) {
                pageData[url].videoLink = link;
                return;
            }
        }
    }

    console.error(`Ошибка: Уникальный ID ${id} не найден.`);
};

const getComments = (id) => {
    for (const url in pageData) {
        if (pageData.hasOwnProperty(url)) {
            const ids = pageData[url].ids;
            if (ids.includes(id)) {
                return pageData[url].logs;
            }
        }
    }
    console.error(`Ошибка: Уникальный ID ${id} не найден.`);
};

const getLink = (id) => {
    for (const url in pageData) {
        if (pageData.hasOwnProperty(url)) {
            const ids = pageData[url].ids;
            if (ids.includes(id)) {
                return pageData[url].videoLink;
            }
        }
    }

    console.error(`Ошибка: Уникальный ID ${id} не найден.`);
};

const pageData = {};
let clients = {};

webSocketServer.on('connection', (ws) => {
    var id = Math.random();
    clients[id] = ws;
    console.log('новое соединение ' + id);
    ws.on('error', (e) => ws.send(e));

    ws.send('WS connected_');

    ws.on('message', function (message) {
        message = String(message).trim();

        const delimiterIndex = message.indexOf('_');
        const substringBeforeDelimiter = message.substring(0, delimiterIndex);
        const substringAfterDelimiter = message.substring(delimiterIndex + 1);
        console.log(substringBeforeDelimiter);

        switch (substringBeforeDelimiter) {
            case 'new':
                addNewPage(substringAfterDelimiter, id);
                const data = {
                    commentsData: getComments(id),
                    link: getLink(id),
                };

                const jsonData = JSON.stringify(data);

                clients[id].send('recoveryAfterReload_' + jsonData);

                break;
            case 'play':
                getGroupIdsFromPage(id).forEach((id) =>
                    clients[id].send('play_')
                );

                break;
            case 'pause':
                getGroupIdsFromPage(id).forEach((id) =>
                    clients[id].send('pause_')
                );

                break;
            case 'seekTo':
                getGroupIdsFromPage(id).forEach((id) =>
                    clients[id].send('seekTo_' + substringAfterDelimiter)
                );

                break;
            case 'message':
                addNewMessage(id, substringAfterDelimiter);
                const messages = {
                    commentsData: getComments(id),
                };
                getGroupIdsFromPage(id).forEach((id) =>
                    clients[id].send('message_' + JSON.stringify(messages))
                );

                break;
            case 'videoLink':
                checkLinkToFile(id);
                changeVideoLink(id, substringAfterDelimiter);
                getGroupIdsFromPage(id).forEach((id) =>
                    clients[id].send('videoLink_' + substringAfterDelimiter)
                );

                break;
            default:
                ws.send('неизвестная команда синхронизации.');
                console.log(
                    `неизвестный идентификатор: ${substringBeforeDelimiter}`
                );
        }
        console.log(pageData);
    });

    ws.on('close', function () {
        console.log('соединение закрыто ' + id);
        deleteIdFromPage(id);
        console.log(pageData);
        delete clients[id];
    });
});

mongoose
    .connect(
        'mongodb+srv://grigoriyartemyev2:5dBI8ytdk5sstfgU@videodb.bycbfaz.mongodb.net/?retryWrites=true&w=majority&appName=videoDB'
    )
    .then(() => {
        console.log('connented mongoDB sucseccfull');
        server.listen(port, () => {
            console.log(`listen ${port}!`);
        });
    })
    .catch((err) => {
        console.log(`connented mongoDB failed, ${err}`);
    });
