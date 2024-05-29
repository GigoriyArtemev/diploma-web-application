import React from 'react';
import { useNavigate } from 'react-router-dom';
import { makeid } from '../components/Utility';

const Mainpage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/room/${makeid(8)}`);
    };

    return (
        <div className='centered-container'>
            <div className='container'>
                <div className='frame'>
                    <button
                        onClick={handleClick}
                        className='button'
                        type='button'
                    >
                        Создать комнату
                    </button>
                    <button
                        onClick={() => navigate('/auth/login')}
                        className='button'
                        type='button'
                    >
                        Войти
                    </button>
                    <button
                        onClick={() => navigate('/auth/register')}
                        className='button'
                        type='button'
                    >
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    );
};

export { Mainpage };
