import React, { useState, useEffect, useRef } from 'react';

const Chat = ({ newMessage, receivedMessage }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (receivedMessage.length) {
            setMessages(receivedMessage);
        }
    }, [receivedMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessageSend = () => {
        if (inputValue.trim() !== '') {
            newMessage(inputValue);
            setMessages((prevMessages) => [...prevMessages, inputValue]);
            setInputValue('');
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className='chat-container'>
            <div className='input-chat-container'>
                <input
                    type='text'
                    placeholder='Введите сообщение'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleMessageSend}>Отправить</button>
            </div>
            <div className='messages-container'>
                {messages.map((message, index) => (
                    <div key={index} className='message'>
                        {message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Chat;
