const jwtToken = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: 'Пользователь не авторизован' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Пользователь не авторизован' });
        }
        console.log(`ТОКЕН: ${token}`);
        const decodedData = jwtToken.verify(token, secret);
        console.log(`Декодированные данные: ${JSON.stringify(decodedData)}`);
        req.user = decodedData;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
};
