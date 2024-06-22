import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('/user/videos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                });
                setVideos(response.data);
            } catch (error) {
                console.error('Ошибка получения видео', error);
                if (
                    error.response.data.message ===
                    'Пользователь не авторизован'
                ) {
                    navigate(`/auth/login`);
                }
            }
        };
        fetchVideos();
    }, []);

    const handleVideoClick = (videoId) => {
        document.querySelectorAll('video').forEach((video) => {
            video.pause();
            video.currentTime = 0;
        });

        navigate(`/room/${encodeURIComponent(videoId)}`);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);

        try {
            await axios.post('/user/userUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const response = await axios.get('/user/videos', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setVideos(response.data);
        } catch (error) {
            console.error('Ошибка загрузки видео', error);
        }
    };

    const handleDelete = async (videoId) => {
        try {
            await axios.delete(`/user/videos/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setVideos(videos.filter((video) => video._id !== videoId));
        } catch (error) {
            console.error('Ошибка удаления видео', error);
        }
    };

    return (
        <div className='dashboard'>
            <h2>Личный кабинет</h2>
            <form onSubmit={handleUpload}>
                <input
                    type='text'
                    placeholder='Название видео'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type='file'
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type='submit'>Загрузить видео</button>
            </form>
            <div className='video-list'>
                {videos.map((video) => (
                    <div key={video._id}>
                        <h3 onClick={() => handleVideoClick(video.path)}>
                            {video.title}
                        </h3>
                        <video src={`/${video.path}`} controls />
                        <button onClick={() => handleDelete(video._id)}>
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
