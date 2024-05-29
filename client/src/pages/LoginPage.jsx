import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', {
                username,
                password,
            });
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token); // Сохраняем токен в localStorage
                console.log(
                    `Сохранённый токен: ${localStorage.getItem('token')}`
                );
                navigate('/dashboard');
            } else {
                alert('Не удалось получить токен');
            }
        } catch (error) {
            alert('Ошибка входа');
        }
    };

    return (
        <div className='login-page'>
            <h3>Вход</h3>
            <form onSubmit={handleLogin}>
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
                <button type='submit'>Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;
