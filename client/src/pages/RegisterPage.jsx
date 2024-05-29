import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/registration', { username, password });
            alert('Регистрация успешна');
        } catch (error) {
            alert('Ошибка регистрации');
        }
    };

    return (
        <div className='register-page'>
            <h3>Регистрация</h3>
            <form onSubmit={handleRegister}>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Имя пользователя'
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Пароль'
                />
                <button type='submit'>Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default RegisterPage;
