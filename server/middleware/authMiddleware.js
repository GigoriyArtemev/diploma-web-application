const jwtToken = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res
                .status(400)
                .json({ message: 'Пользователь не авторизован' });
        }
        const decodedData = jwtToken.verify(token, secret); //здесь обьект с id и ролями
        req.user = decodedData;
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Пользователь не авторизован' });
    }
};
