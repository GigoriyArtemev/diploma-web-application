const jwtToken = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (roles) {
    return function (req, res, next) {
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
            const { roles: userRoles } = jwtToken.verify(token, secret);
            let hasRole = false;
            userRoles.forEach((role) => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res
                    .status(400)
                    .json({ message: 'у вас недостаточно прав' });
            }
            next();
        } catch (err) {
            console.log(err);
            return res
                .status(400)
                .json({ message: 'Пользователь не авторизован' });
        }
    };
};
