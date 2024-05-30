import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';

const AuthPage = () => {
    return (
        <div className='auth-container'>
            <h2 className='text-center'>Аутентификация</h2>
            <Routes>
                <Route path='register' element={<RegisterPage />} />
                <Route path='login' element={<LoginPage />} />
            </Routes>
            <div className='d-flex justify-content-center mt-4'>
                <Link
                    to='/auth/register'
                    className='btn btn-outline-primary me-2'
                >
                    Регистрация
                </Link>
                <Link to='/auth/login' className='btn btn-outline-primary'>
                    Вход
                </Link>
            </div>
        </div>
    );
};

export default AuthPage;
