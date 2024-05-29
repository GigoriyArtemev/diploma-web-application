const { Schema, model } = require('mongoose');

const VideoSchema = new Schema({
    title: { type: String, required: true },
    path: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Добавляем ссылку на пользователя
});

module.exports = model('Video', VideoSchema);
