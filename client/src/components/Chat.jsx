import React, { useState } from 'react';
import { useEffect } from 'react';

const Chat = ({ newMessage, receivedMessage }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (receivedMessage.length) {
            setMessages(receivedMessage);
        }
    }, [receivedMessage]);

    const handleMessageSend = () => {
        if (inputValue.trim() !== '') {
            newMessage(inputValue); //отправляем коллбек
            setInputValue(''); // Очищаем поле ввода после отправки сообщения
        }
    };

    return (
        <div className='chat-container'>
            <div className='messages-container'>
                {messages.map((message, index) => (
                    <div key={index} className='message'>
                        {message}
                    </div>
                ))}
            </div>
            <div className='input-chat-container'>
                <input
                    type='text'
                    placeholder='Введите сообщение'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleMessageSend}>Отправить</button>
            </div>
        </div>
    );
};

export default Chat;
