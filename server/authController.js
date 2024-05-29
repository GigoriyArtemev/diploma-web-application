const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config');

const generateToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwtToken.sign(payload, secret, { expiresIn: '24h' });
};
class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: 'ошибка регистрации:', errors });
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({
                    message: 'Пользователь с таким именем уже существует',
                });
            }

            const hashPassword = bcrypt.hashSync(password, 6);
            const userRole = await Role.findOne({ value: 'USER' });
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            });
            await user.save();
            return res.json({
                message: 'Пользователь успешно зарегистрирован!',
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'Пользователь не найден' });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }
            const token = generateToken(user._id, user.roles);
            return res.json({ token });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'Login error' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
            res.json('controllerWork');
        } catch (err) {}
    }
}
module.exports = new authController();
