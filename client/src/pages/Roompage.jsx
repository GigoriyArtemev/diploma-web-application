import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { InputWithButton } from '../components/InputWithButton';
import Player from '../components/Player';
import Chat from '../components/Chat';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const Room = () => {
    const [currentPageUrl, setCurrentPageUrl] = useState(window.location.href);
    const [lastMessage, setLastMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState([]);
    const [wsConnection, setWsConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activeTab, setActiveTab] = useState('tab1');
    const [videoPlay, setVideoState] = useState(false);
    const [seekValue, setSeekValue] = useState(0);
    const [receivedSeek, setReceivedSeek] = useState(0);
    const [receivedVideLink, setReceivedVideLink] = useState(
        'https://youtu.be/8hSVJAOd5go?si=8YDb6jrpU7TsLv9H'
    );
    const [inputValue, setInputValue] = useState(
        'https://youtu.be/8hSVJAOd5go?si=8YDb6jrpU7TsLv9H'
    );
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const connection = new WebSocket('ws://192.168.3.21:5000');
        setWsConnection(connection);

        setCurrentPageUrl(window.location.href);

        connection.onopen = function () {
            console.log('Соединение установлено.');
            setIsConnected(true);
            connection.send('new_' + currentPageUrl);
        };

        connection.onclose = function (event) {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения');
            }

            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        connection.onerror = function (error) {
            console.log('Ошибка ' + error.message);
        };

        connection.onmessage = function (event) {
            const message = String(event.data).trim();
            const delimiterIndex = message.indexOf('_');
            const substringBeforeDelimiter = message.substring(
                0,
                delimiterIndex
            );
            const substringAfterDelimiter = message.substring(
                delimiterIndex + 1
            );
            switch (substringBeforeDelimiter) {
                case 'WS connected':
                    break;
                case 'pause':
                    setVideoState(false);
                    break;
                case 'play':
                    setVideoState(true);
                    break;
                case 'seekTo':
                    setReceivedSeek(
                        Number(parseFloat(substringAfterDelimiter))
                    );
                    console.log(Number(parseFloat(substringAfterDelimiter)));
                    break;
                case 'videoLink':
                    if (
                        receivedVideLink !== substringAfterDelimiter &&
                        substringAfterDelimiter
                    ) {
                        setReceivedVideLink(substringAfterDelimiter);
                    }
                    break;
                case 'message':
                    if (
                        JSON.parse(substringAfterDelimiter).commentsData.length
                    ) {
                        setReceivedMessage(
                            JSON.parse(substringAfterDelimiter).commentsData
                        );
                    }
                    break;
                case 'recoveryAfterReload':
                    const data = JSON.parse(substringAfterDelimiter);
                    if (receivedVideLink !== data.link && data.link) {
                        setReceivedVideLink(data.link);
                    }
                    if (data.commentsData.length) {
                        setReceivedMessage(data.commentsData);
                    }
                    break;
                default:
                    console.log(
                        `Error: неизвестная команда сервера (${message})`
                    );
            }
        };

        return () => {
            connection.close();
        };
    }, []);

    useEffect(() => {
        if (wsConnection && lastMessage !== '') {
            wsConnection.send('message_' + lastMessage);
        }
    }, [isConnected, wsConnection, lastMessage]);

    useEffect(() => {
        if (isConnected && wsConnection && inputValue !== '') {
            wsConnection.send('videoLink_' + inputValue);
        }
    }, [isConnected, wsConnection, inputValue]);

    useEffect(() => {
        if (isConnected && wsConnection) {
            videoPlay
                ? wsConnection.send('play_')
                : wsConnection.send('pause_');
        }
    }, [isConnected, wsConnection, videoPlay]);

    useEffect(() => {
        if (isConnected && wsConnection) {
            wsConnection.send('seekTo_' + seekValue);
        }
    }, [isConnected, wsConnection, seekValue]);

    const { id } = useParams();

    const handleLinkChange = (link) => {
        setInputValue(link);
    };

    const handleMessage = (message) => {
        setLastMessage(message);
    };

    const openTab = (tabId) => {
        setActiveTab(tabId);
    };

    const handlePause = () => {
        setVideoState(false);
    };

    const handlePlay = () => {
        setVideoState(true);
    };

    const handleSeeking = (value) => {
        setSeekValue(value);
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const formData = new FormData();
            formData.append('video', acceptedFiles[0]);

            setIsUploading(true);

            axios
                .post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    setReceivedVideLink(response.data.url);
                    wsConnection.send('videoLink_' + response.data.url);
                    setIsUploading(false);
                    setActiveTab('tab1'); // Switch to the first tab
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    setIsUploading(false);
                });
        },
        [wsConnection]
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

    return (
        <div>
            <header>
                <h1>Шапка страницы</h1>
            </header>
            <main>
                <div className='tabs'>
                    <Button
                        onClick={() => openTab('tab1')}
                        active={activeTab === 'tab1'}
                    >
                        YouTube player
                    </Button>
                    <Button
                        onClick={() => openTab('tab2')}
                        active={activeTab === 'tab2'}
                    >
                        Your video
                    </Button>
                </div>
                <div>
                    <Chat
                        newMessage={handleMessage}
                        receivedMessage={receivedMessage}
                    ></Chat>
                </div>
                {activeTab === 'tab1' && (
                    <div id='tab1' className='tab-content active'>
                        <InputWithButton onInputChange={handleLinkChange} />
                        <Player
                            url={receivedVideLink} // Display uploaded video if available
                            onPause={handlePause}
                            onPlay={handlePlay}
                            onSeek={handleSeeking}
                            receivedVideoState={videoPlay}
                            receivedSeek={receivedSeek}
                        />
                    </div>
                )}
                {activeTab === 'tab2' && (
                    <div id='tab2' className='tab-content active'>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>
                                Перетащите сюда файл или кликните, чтобы выбрать
                                файл
                            </p>
                            {isUploading && <p>Загрузка...</p>}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export { Room };
