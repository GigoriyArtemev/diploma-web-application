import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeid } from '../components/Utility';

const Mainpage = () => {
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleClick = () => {
        navigate(`/room/${makeid(8)}`);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
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
                    <div className='dropdown'>
                        <button
                            onClick={toggleDropdown}
                            className='button'
                            type='button'
                        >
                            Войти / Регистрация
                        </button>
                        {dropdownVisible && (
                            <div className='dropdown-content'>
                                <button
                                    onClick={() => navigate('/auth/login')}
                                    className='dropdown-item'
                                    type='button'
                                >
                                    Войти
                                </button>
                                <button
                                    onClick={() => navigate('/auth/register')}
                                    className='dropdown-item'
                                    type='button'
                                >
                                    Регистрация
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Mainpage };
