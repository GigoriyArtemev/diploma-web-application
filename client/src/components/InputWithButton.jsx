import React from 'react';
import { useState } from 'react';

function InputWithButton({ onInputChange }) {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    const handleSubmit = () => {
        // Здесь можно выполнить действия по отправке значения,
        // например, отправить его на сервер или использовать в другом месте приложения
        onInputChange(value);
    };

    return (
        <div className='input-container'>
            <input
                type='text'
                value={value}
                onChange={handleChange}
                placeholder='Paste YouTube link...'
            />
            <button onClick={handleSubmit}>Go</button>
        </div>
    );
}

export { InputWithButton };
