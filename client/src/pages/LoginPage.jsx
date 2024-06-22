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
                localStorage.setItem('token', token);
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
            <h3 className='text-center'>Вход</h3>
            <form onSubmit={handleLogin}>
                <div className='mb-3'>
                    <input
                        type='text'
                        className='form-control'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Имя пользователя'
                    />
                </div>
                <div className='mb-3'>
                    <input
                        type='password'
                        className='form-control'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Пароль'
                    />
                </div>
                <button type='submit' className='btn btn-primary w-100'>
                    Войти
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
