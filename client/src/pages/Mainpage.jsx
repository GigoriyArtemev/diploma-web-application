import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeid } from '../components/Utility';
const Mainpage = () => {
    const navigate = useNavigate();
    // const [data, setData] = useState(null);
    const handleClick = () => {
        navigate(`/room/${makeid(8)}`);
    };
    // useEffect(() => {
    //     fetch('/api')
    //         .then(
    //             (response) => response.json() // парсим JSON ответ
    //         )
    //         .then(
    //             (response) => setData(response.message) // обрабатываем полученные данные
    //         );
    // }, []);
    // !data ? console.log('loading') : console.log(data);
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
                </div>
            </div>
        </div>
    );
};
export { Mainpage };
