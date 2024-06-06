const Router = require('express');
const controller = require('../authController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = new Router();
router.post(
    '/registration',
    [
        check('username', 'Имя пользователя не может быть пустым').notEmpty(),
        check('password', 'Пароль должен быть больше 4 символов').isLength({
            min: 4,
            max: 15,
        }),
    ],
    controller.registration
);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);

module.exports = router;
