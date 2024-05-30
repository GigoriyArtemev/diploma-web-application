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
            <h3 className='text-center'>Регистрация</h3>
            <form onSubmit={handleRegister}>
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
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
