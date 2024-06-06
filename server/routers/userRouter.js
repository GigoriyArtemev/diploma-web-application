const authMiddleware = require('../middleware/authMiddleware');
const Video = require('../models/Video');
const multer = require('multer');
const fs = require('fs');
const Router = require('express');
const userUpload = multer({ dest: 'userUploads/' });

const router = new Router();

router.post(
    '/userUpload',
    authMiddleware,
    userUpload.single('video'),
    async (req, res) => {
        try {
            const { title } = req.body;
            const videoPath = req.file.path;
            const userId = req.user.id;

            const video = new Video({
                title,
                path: videoPath,
                user: userId,
            });

            await video.save();

            res.status(200).json({ videoId: video._id });
        } catch (error) {
            res.status(500).send('Ошибка загрузки видео');
        }
    }
);

router.get('/videos', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const videos = await Video.find({ user: userId });
        res.json(videos);
    } catch (error) {
        res.status(500).send('Ошибка получения видео');
    }
});

router.delete('/videos/:id', authMiddleware, async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        const video = await Video.findOneAndDelete({
            _id: videoId,
            user: userId,
        });

        if (!video) {
            return res.status(404).send('Видео не найдено');
        }

        // Удаляем видео файл с сервера
        fs.unlink(video.path, (err) => {
            if (err) {
                console.error('Ошибка удаления видео файла', err);
            }
        });

        res.status(200).send('Видео удалено');
    } catch (error) {
        res.status(500).send('Ошибка удаления видео');
    }
});

module.exports = router;
