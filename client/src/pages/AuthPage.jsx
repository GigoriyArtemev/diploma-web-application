import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';

const AuthPage = () => {
    return (
        <div className='auth-container'>
            <h2>Аутентификация</h2>
            <Routes>
                <Route path='register' element={<RegisterPage />} />
                <Route path='login' element={<LoginPage />} />
            </Routes>
            <Link to='/auth/register'>Регистрация</Link>
            <Link to='/auth/login'>Вход</Link>
        </div>
    );
};

export default AuthPage;
